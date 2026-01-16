import type { CafeSearchResult } from '@/lib/types';
import type { CafeProvider, CafeSearchParams, GeocodingResult } from '../types';

/**
 * Google Places API provider stub
 *
 * To use this provider:
 * 1. Get a Google Places API key from Google Cloud Console
 * 2. Enable the Places API and Geocoding API
 * 3. Set GOOGLE_PLACES_API_KEY in your environment
 *
 * This is a stub implementation - full implementation would require:
 * - Nearby Search API for cafes
 * - Place Details API for additional info
 * - Geocoding API for city lookup
 */

const PLACES_BASE_URL = 'https://maps.googleapis.com/maps/api/place';
const GEOCODE_BASE_URL = 'https://maps.googleapis.com/maps/api/geocode';

/**
 * Check if Google Places API key is configured
 */
function getApiKey(): string | null {
  return process.env.GOOGLE_PLACES_API_KEY || null;
}

/**
 * Google Places provider implementation (stub)
 */
export const googlePlacesProvider: CafeProvider = {
  name: 'Google Places',

  async geocodeCity(city: string): Promise<GeocodingResult | null> {
    const apiKey = getApiKey();
    if (!apiKey) {
      console.warn('Google Places API key not configured');
      return null;
    }

    try {
      const params = new URLSearchParams({
        address: city,
        key: apiKey,
      });

      const response = await fetch(`${GEOCODE_BASE_URL}/json?${params}`);
      const data = await response.json();

      if (data.status !== 'OK' || !data.results?.[0]) {
        return null;
      }

      const result = data.results[0];
      const location = result.geometry.location;

      // Extract city and country from address components
      let cityName: string | undefined;
      let country: string | undefined;
      for (const component of result.address_components || []) {
        if (component.types.includes('locality')) {
          cityName = component.long_name;
        }
        if (component.types.includes('country')) {
          country = component.long_name;
        }
      }

      return {
        lat: location.lat,
        lng: location.lng,
        displayName: result.formatted_address,
        city: cityName,
        country,
      };
    } catch (error) {
      console.error('Google geocoding error:', error);
      return null;
    }
  },

  async searchCafes(params: CafeSearchParams): Promise<CafeSearchResult> {
    const apiKey = getApiKey();
    if (!apiKey) {
      console.warn('Google Places API key not configured');
      return {
        cafes: [],
        query: params.query || '',
        center: { lat: params.lat, lng: params.lng },
        radius: params.radius || 2000,
        totalFound: 0,
      };
    }

    const { lat, lng, radius = 2000, limit = 10 } = params;

    try {
      // Nearby Search for cafes
      const searchParams = new URLSearchParams({
        location: `${lat},${lng}`,
        radius: radius.toString(),
        type: 'cafe',
        keyword: 'coffee',
        key: apiKey,
      });

      const response = await fetch(`${PLACES_BASE_URL}/nearbysearch/json?${searchParams}`);
      const data = await response.json();

      if (data.status !== 'OK') {
        console.error('Google Places search failed:', data.status);
        return {
          cafes: [],
          query: params.query || '',
          center: { lat, lng },
          radius,
          totalFound: 0,
        };
      }

      // Transform Google Places results to Cafe objects
      const cafes = (data.results || [])
        .slice(0, limit)
        .map(
          (place: {
            place_id: string;
            name: string;
            vicinity?: string;
            geometry: { location: { lat: number; lng: number } };
            opening_hours?: { open_now?: boolean };
            types?: string[];
          }) => ({
            id: `google-${place.place_id}`,
            name: place.name,
            address: place.vicinity || 'Address not available',
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
            isOpenNow: place.opening_hours?.open_now,
            osmLink: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
            tags: place.types?.includes('cafe') ? ['cafe'] : [],
          })
        );

      return {
        cafes,
        query: params.query || '',
        center: { lat, lng },
        radius,
        totalFound: data.results?.length || 0,
      };
    } catch (error) {
      console.error('Google Places search error:', error);
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

export default googlePlacesProvider;
