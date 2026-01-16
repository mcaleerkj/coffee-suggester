import type { CafeSearchResult } from '@/lib/types';
import type { CafeProvider, CafeSearchParams, GeocodingResult } from './types';
import { osmProvider } from './providers/osm';
import { googlePlacesProvider } from './providers/google-places';
import prisma from '@/lib/db';

export type { CafeProvider, CafeSearchParams, GeocodingResult };
export { osmProvider, googlePlacesProvider };

// Cache duration in seconds (default 1 hour)
const CACHE_DURATION = parseInt(process.env.CAFE_CACHE_DURATION || '3600', 10);

/**
 * Get the active cafe provider
 * Uses Google Places if API key is configured, otherwise OSM
 */
export function getActiveProvider(): CafeProvider {
  if (process.env.GOOGLE_PLACES_API_KEY) {
    return googlePlacesProvider;
  }
  return osmProvider;
}

/**
 * Round coordinates for cache key consistency
 */
function roundCoord(coord: number, decimals = 3): number {
  return Math.round(coord * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Check cache for existing results
 */
async function getCachedResult(
  lat: number,
  lng: number,
  radius: number
): Promise<CafeSearchResult | null> {
  try {
    const cached = await prisma.cafeSearchCache.findUnique({
      where: {
        lat_lng_radius: {
          lat: roundCoord(lat),
          lng: roundCoord(lng),
          radius,
        },
      },
    });

    if (!cached) return null;

    // Check if cache is expired
    const cacheAge = (Date.now() - cached.createdAt.getTime()) / 1000;
    if (cacheAge > CACHE_DURATION) {
      // Delete expired cache entry
      await prisma.cafeSearchCache.delete({
        where: { id: cached.id },
      });
      return null;
    }

    return JSON.parse(cached.response);
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
}

/**
 * Store result in cache
 */
async function cacheResult(
  lat: number,
  lng: number,
  radius: number,
  query: string,
  result: CafeSearchResult
): Promise<void> {
  try {
    await prisma.cafeSearchCache.upsert({
      where: {
        lat_lng_radius: {
          lat: roundCoord(lat),
          lng: roundCoord(lng),
          radius,
        },
      },
      update: {
        query,
        response: JSON.stringify(result),
        createdAt: new Date(),
      },
      create: {
        lat: roundCoord(lat),
        lng: roundCoord(lng),
        radius,
        query,
        response: JSON.stringify(result),
      },
    });
  } catch (error) {
    console.error('Cache write error:', error);
  }
}

/**
 * Search for cafes with caching
 */
export async function searchCafes(params: CafeSearchParams): Promise<CafeSearchResult> {
  const { lat, lng, radius = 2000 } = params;
  const provider = getActiveProvider();

  // Check cache first
  const cached = await getCachedResult(lat, lng, radius);
  if (cached) {
    return cached;
  }

  // Fetch from provider
  const result = await provider.searchCafes(params);

  // Cache the result
  if (result.cafes.length > 0) {
    await cacheResult(lat, lng, radius, params.query || '', result);
  }

  return result;
}

/**
 * Geocode a city name to coordinates
 */
export async function geocodeCity(city: string): Promise<GeocodingResult | null> {
  const provider = getActiveProvider();
  return provider.geocodeCity(city);
}

/**
 * Clean up expired cache entries
 * Can be called periodically or via a cron job
 */
export async function cleanupExpiredCache(): Promise<number> {
  const expiryDate = new Date(Date.now() - CACHE_DURATION * 1000);

  const result = await prisma.cafeSearchCache.deleteMany({
    where: {
      createdAt: {
        lt: expiryDate,
      },
    },
  });

  return result.count;
}
