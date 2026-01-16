import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';

const TrackEventSchema = z.object({
  type: z.enum([
    'quiz_start',
    'quiz_complete',
    'recommendation_view',
    'cafe_search',
    'share_link_created',
    'share_link_viewed',
  ]),
  payload: z.record(z.unknown()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate
    const validationResult = TrackEventSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ error: 'Invalid event data' }, { status: 400 });
    }

    const { type, payload } = validationResult.data;

    // Store event
    await prisma.analyticsEvent.create({
      data: {
        type,
        payload: JSON.stringify(payload || {}),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
  }
}
