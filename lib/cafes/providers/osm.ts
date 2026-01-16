import type { Cafe, CafeSearchResult } from '@/lib/types';
import type { CafeProvider, CafeSearchParams, GeocodingResult } from '../types';

/**
 * OpenStreetMap/Overpass API provider for cafe searches
 * Free to use, no API key required
 * Uses Nominatim for geocoding and Overpass for cafe search
 */

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const OVERPASS_BASE_URL = 'https://overpass-api.de/api/interpreter';

// User agent as required by Nominatim usage policy
const USER_AGENT = 'CoffeeSuggester/1.0 (https://github.com/coffee-suggester)';

// Request timeout in ms
const TIMEOUT = 10000;

/**
 * Fetch with timeout and retries
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = TIMEOUT,
  retries = 2
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const fetchOptions: RequestInit = {
    ...options,
    signal: controller.signal,
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, fetchOptions);
    clearTimeout(timeoutId);

    if (!response.ok && retries > 0) {
      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return fetchWithTimeout(url, options, timeout, retries - 1);
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return fetchWithTimeout(url, options, timeout, retries - 1);
    }
    throw error;
  }
}

/**
 * Calculate distance between two coordinates in meters
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Parse opening hours from OSM format
 * Returns a simplified string
 */
function parseOpeningHours(hours: string | undefined): string | undefined {
  if (!hours) return undefined;

  // OSM opening hours can be complex, return simplified version
  // For now, just return the raw string if it's not too long
  if (hours.length > 50) {
    return 'Hours vary';
  }
  return hours;
}

/**
 * Build Overpass query for cafes
 */
function buildOverpassQuery(lat: number, lng: number, radius: number): string {
  // Search for cafes and coffee shops
  // Using amenity=cafe and cuisine=coffee_shop
  return `
    [out:json][timeout:25];
    (
      node["amenity"="cafe"](around:${radius},${lat},${lng});
      way["amenity"="cafe"](around:${radius},${lat},${lng});
      node["cuisine"~"coffee"](around:${radius},${lat},${lng});
      node["shop"="coffee"](around:${radius},${lat},${lng});
    );
    out center body;
  `.trim();
}

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: {
    name?: string;
    'addr:street'?: string;
    'addr:housenumber'?: string;
    'addr:city'?: string;
    opening_hours?: string;
    cuisine?: string;
    [key: string]: string | undefined;
  };
}

/**
 * OSM Cafe Provider implementation
 */
export const osmProvider: CafeProvider = {
  name: 'OpenStreetMap',

  async geocodeCity(city: string): Promise<GeocodingResult | null> {
    try {
      const params = new URLSearchParams({
        q: city,
        format: 'json',
        limit: '1',
        addressdetails: '1',
      });

      const response = await fetchWithTimeout(`${NOMINATIM_BASE_URL}/search?${params}`);

      if (!response.ok) {
        console.error('Nominatim geocoding failed:', response.status);
        return null;
      }

      const results = await response.json();

      if (!results || results.length === 0) {
        return null;
      }

      const result = results[0];
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        displayName: result.display_name,
        city: result.address?.city || result.address?.town || result.address?.village,
        country: result.address?.country,
      };
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  },

  async searchCafes(params: CafeSearchParams): Promise<CafeSearchResult> {
    const { lat, lng, radius = 2000, limit = 10 } = params;

    try {
      const query = buildOverpassQuery(lat, lng, radius);
      const response = await fetchWithTimeout(
        OVERPASS_BASE_URL,
        {
          method: 'POST',
          body: `data=${encodeURIComponent(query)}`,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
        15000 // Longer timeout for Overpass
      );

      if (!response.ok) {
        console.error('Overpass API error:', response.status);
        return {
          cafes: [],
          query: params.query || '',
          center: { lat, lng },
          radius,
          totalFound: 0,
        };
      }

      const data = await response.json();
      const elements: OverpassElement[] = data.elements || [];

      // Transform Overpass elements to Cafe objects
      const cafes: Cafe[] = elements
        .filter((el) => el.tags?.name) // Must have a name
        .map((el) => {
          const elLat = el.lat || el.center?.lat || lat;
          const elLng = el.lon || el.center?.lon || lng;

          // Build address string
          const addressParts: string[] = [];
          if (el.tags?.['addr:housenumber']) addressParts.push(el.tags['addr:housenumber']);
          if (el.tags?.['addr:street']) addressParts.push(el.tags['addr:street']);
          if (el.tags?.['addr:city']) addressParts.push(el.tags['addr:city']);

          // Build tags
          const tags: string[] = [];
          if (el.tags?.cuisine?.includes('coffee')) tags.push('specialty');
          if (el.tags?.['internet_access'] === 'wlan') tags.push('wifi');
          if (el.tags?.['outdoor_seating'] === 'yes') tags.push('outdoor');

          return {
            id: `osm-${el.type}-${el.id}`,
            name: el.tags?.name || 'Unknown Cafe',
            address: addressParts.length > 0 ? addressParts.join(' ') : 'Address not available',
            lat: elLat,
            lng: elLng,
            distance: calculateDistance(lat, lng, elLat, elLng),
            openingHours: parseOpeningHours(el.tags?.opening_hours),
            osmLink: `https://www.openstreetmap.org/${el.type}/${el.id}`,
            tags,
          };
        })
        // Sort by distance
        .sort((a, b) => (a.distance || 0) - (b.distance || 0))
        // Limit results
        .slice(0, limit);

      return {
        cafes,
        query: params.query || '',
        center: { lat, lng },
        radius,
        totalFound: elements.length,
      };
    } catch (error) {
      console.error('Cafe search error:', error);
      return {
        cafes: [],
        query: params.query || '',
        center: { lat, lng },
        radius,
        totalFound: 0,
      };
    }
  },
};

export default osmProvider;
