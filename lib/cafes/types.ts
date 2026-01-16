import type { Cafe, CafeSearchResult } from '@/lib/types';

/**
 * Search parameters for cafe providers
 */
export interface CafeSearchParams {
  lat: number;
  lng: number;
  radius?: number; // in meters, default 2000
  query?: string; // optional search query
  limit?: number; // max results, default 10
}

/**
 * Geocoding result for converting city names to coordinates
 */
export interface GeocodingResult {
  lat: number;
  lng: number;
  displayName: string;
  city?: string;
  country?: string;
}

/**
 * Pluggable cafe provider interface
 * Implementations must provide these methods
 */
export interface CafeProvider {
  name: string;
  searchCafes(params: CafeSearchParams): Promise<CafeSearchResult>;
  geocodeCity(city: string): Promise<GeocodingResult | null>;
}

/**
 * Cache entry for cafe searches
 */
export interface CafeCacheEntry {
  result: CafeSearchResult;
  timestamp: number;
}
