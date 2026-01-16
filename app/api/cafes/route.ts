import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { searchCafes, geocodeCity } from '@/lib/cafes';
import prisma from '@/lib/db';

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = parseInt(process.env.CAFE_SEARCH_RATE_LIMIT || '30', 10);
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

const CafeSearchSchema = z.object({
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  city: z.string().min(1).max(100).optional(),
  radius: z.coerce.number().min(100).max(50000).optional(),
  limit: z.coerce.number().min(1).max(20).optional(),
});

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse query params
    const searchParams = request.nextUrl.searchParams;
    const params = {
      lat: searchParams.get('lat'),
      lng: searchParams.get('lng'),
      city: searchParams.get('city'),
      radius: searchParams.get('radius'),
      limit: searchParams.get('limit'),
    };

    // Validate
    const validationResult = CafeSearchSchema.safeParse(params);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { lat, lng, city, radius = 2000, limit = 10 } = validationResult.data;

    // Need either lat/lng or city
    if (!((lat && lng) || city)) {
      return NextResponse.json(
        { error: 'Please provide either lat/lng coordinates or a city name' },
        { status: 400 }
      );
    }

    let searchLat = lat;
    let searchLng = lng;

    // Geocode city if needed
    if (city && (!lat || !lng)) {
      const geoResult = await geocodeCity(city);
      if (!geoResult) {
        return NextResponse.json({ error: `Could not find location: ${city}` }, { status: 404 });
      }
      searchLat = geoResult.lat;
      searchLng = geoResult.lng;
    }

    // Search for cafes
    const result = await searchCafes({
      lat: searchLat!,
      lng: searchLng!,
      radius,
      limit,
      query: city,
    });

    // Track analytics
    await prisma.analyticsEvent.create({
      data: {
        type: 'cafe_search',
        payload: JSON.stringify({
          hasLocation: !!(lat && lng),
          city: city || null,
          resultCount: result.cafes.length,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Cafe search error:', error);
    return NextResponse.json({ error: 'Failed to search for cafes' }, { status: 500 });
  }
}
