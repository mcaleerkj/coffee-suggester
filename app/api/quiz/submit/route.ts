import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { generateRecommendation } from '@/lib/recommendation';
import { QuizAnswersSchema } from '@/lib/types';
import { generateShareSlug } from '@/lib/utils';

// Partial schema for quiz submission (not all fields required)
const SubmitQuizSchema = z.object({
  milkPreference: z.enum(['black', 'with-milk', 'sweetened']),
  temperature: z.enum(['hot', 'iced', 'both']),
  flavorPreference: z.enum(['chocolatey', 'fruity', 'nutty', 'balanced']),
  coffeeContext: z.enum(['home', 'cafe', 'both']),
  equipment: z
    .enum([
      'none',
      'drip',
      'french-press',
      'pour-over',
      'aeropress',
      'moka-pot',
      'espresso',
      'pods',
    ])
    .optional(),
  wantsCafeSuggestions: z.boolean().optional(),
  location: z
    .object({
      city: z.string().optional(),
      lat: z.number().optional(),
      lng: z.number().optional(),
    })
    .optional(),
  acidityTolerance: z.enum(['normal', 'low-acidity']).optional(),
  currentOrder: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = SubmitQuizSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid quiz answers', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const answers = validationResult.data;

    // Generate recommendation
    const recommendation = generateRecommendation(answers);

    // Generate unique share slug
    let shareSlug = generateShareSlug();
    let attempts = 0;
    while (attempts < 5) {
      const existing = await prisma.result.findUnique({
        where: { shareSlug },
      });
      if (!existing) break;
      shareSlug = generateShareSlug();
      attempts++;
    }

    // Store result
    const result = await prisma.result.create({
      data: {
        shareSlug,
        answers: JSON.stringify(answers),
        recommendation: JSON.stringify(recommendation),
      },
    });

    // Track analytics (quiz completion)
    await prisma.analyticsEvent.create({
      data: {
        type: 'quiz_complete',
        payload: JSON.stringify({
          milkPreference: answers.milkPreference,
          temperature: answers.temperature,
          flavorPreference: answers.flavorPreference,
          coffeeContext: answers.coffeeContext,
          equipment: answers.equipment,
          recommendationId: recommendation.bestMatch.id,
          alternativeId: recommendation.alternative.id,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      shareSlug: result.shareSlug,
      recommendation,
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    return NextResponse.json({ error: 'Failed to process quiz' }, { status: 500 });
  }
}
