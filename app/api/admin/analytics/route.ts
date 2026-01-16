import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// Verify admin password
function verifyPassword(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const password = authHeader.substring(7);
  return password === process.env.ADMIN_PASSWORD;
}

export async function GET(request: NextRequest) {
  // Check authentication
  if (!verifyPassword(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get date range from query params (default: last 30 days)
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '30', 10);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch all events in the date range
    const events = await prisma.analyticsEvent.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Aggregate data
    const quizStarts = events.filter((e) => e.type === 'quiz_start').length;
    const quizCompletions = events.filter((e) => e.type === 'quiz_complete').length;
    const cafeSearches = events.filter((e) => e.type === 'cafe_search').length;

    // Parse payloads for detailed analytics
    const completionEvents = events
      .filter((e) => e.type === 'quiz_complete')
      .map((e) => JSON.parse(e.payload));

    // Flavor preference distribution
    const flavorCounts: Record<string, number> = {};
    completionEvents.forEach((event) => {
      const flavor = event.flavorPreference;
      if (flavor) {
        flavorCounts[flavor] = (flavorCounts[flavor] || 0) + 1;
      }
    });

    // Equipment distribution
    const equipmentCounts: Record<string, number> = {};
    completionEvents.forEach((event) => {
      const equipment = event.equipment || 'not-specified';
      equipmentCounts[equipment] = (equipmentCounts[equipment] || 0) + 1;
    });

    // Recommendation distribution
    const recommendationCounts: Record<string, number> = {};
    completionEvents.forEach((event) => {
      const rec = event.recommendationId;
      if (rec) {
        recommendationCounts[rec] = (recommendationCounts[rec] || 0) + 1;
      }
    });

    // Daily activity
    const dailyActivity: Record<string, { starts: number; completions: number }> = {};
    events.forEach((event) => {
      const date = event.createdAt.toISOString().split('T')[0];
      if (!dailyActivity[date]) {
        dailyActivity[date] = { starts: 0, completions: 0 };
      }
      if (event.type === 'quiz_start') {
        dailyActivity[date].starts++;
      } else if (event.type === 'quiz_complete') {
        dailyActivity[date].completions++;
      }
    });

    // Convert daily activity to array
    const dailyActivityArray = Object.entries(dailyActivity)
      .map(([date, data]) => ({
        date,
        ...data,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Total results created
    const totalResults = await prisma.result.count();

    return NextResponse.json({
      success: true,
      summary: {
        quizStarts,
        quizCompletions,
        conversionRate: quizStarts > 0 ? ((quizCompletions / quizStarts) * 100).toFixed(1) : 0,
        cafeSearches,
        totalResults,
      },
      flavorPreferences: Object.entries(flavorCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      equipment: Object.entries(equipmentCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      topRecommendations: Object.entries(recommendationCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      dailyActivity: dailyActivityArray,
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
