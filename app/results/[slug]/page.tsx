import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Coffee, ArrowLeft, Share2, Copy, MapPin, ExternalLink } from 'lucide-react';
import prisma from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { QuizAnswers, RecommendationOutput } from '@/lib/types';
import { CopyButton } from '@/components/results/copy-button';
import { ShareButton } from '@/components/results/share-button';
import { CafeList } from '@/components/results/cafe-list';
import { BrewTipsCard } from '@/components/results/brew-tips-card';
import { AlternativeCard } from '@/components/results/alternative-card';

interface ResultsPageProps {
  params: { slug: string };
}

async function getResult(slug: string) {
  const result = await prisma.result.findUnique({
    where: { shareSlug: slug },
  });

  if (!result) return null;

  return {
    ...result,
    answers: JSON.parse(result.answers) as QuizAnswers,
    recommendation: JSON.parse(result.recommendation) as RecommendationOutput,
  };
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const result = await getResult(params.slug);

  if (!result) {
    notFound();
  }

  const { recommendation, answers } = result;
  const { bestMatch, alternative, explanation, confidenceStatement, brewTips, cafeOrderScript } =
    recommendation;

  const showCafes = answers.wantsCafeSuggestions && answers.location;

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Header */}
      <header className="w-full py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-coffee-600 hover:text-coffee-800">
            <ArrowLeft className="h-6 w-6" />
            <span className="sr-only">Back to home</span>
          </Link>
          <div className="flex items-center gap-2">
            <Coffee className="h-6 w-6 text-coffee-700" />
            <span className="font-semibold text-coffee-900">Your Results</span>
          </div>
        </div>
        <ShareButton slug={params.slug} />
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        {/* Primary recommendation */}
        <section className="animate-slide-up">
          <Card className="border-coffee-200 overflow-hidden">
            <div className="bg-gradient-to-r from-coffee-600 to-coffee-700 text-white px-6 py-4">
              <p className="text-sm font-medium opacity-90">Your perfect match</p>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl text-coffee-900">{bestMatch.name}</CardTitle>
              <CardDescription className="text-base">{bestMatch.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-coffee-700">{explanation}</p>
              <p className="text-sm font-medium text-coffee-600 bg-coffee-50 px-3 py-2 rounded-lg inline-block">
                {confidenceStatement}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {bestMatch.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-coffee-100 text-coffee-700 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Coffee details */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-coffee-100">
                <div>
                  <p className="text-xs text-coffee-500 uppercase tracking-wide">Roast Level</p>
                  <p className="font-medium text-coffee-900 capitalize">{bestMatch.roastLevel}</p>
                </div>
                <div>
                  <p className="text-xs text-coffee-500 uppercase tracking-wide">Origin Style</p>
                  <p className="font-medium text-coffee-900 capitalize">
                    {bestMatch.originStyle.replace('-', ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-coffee-500 uppercase tracking-wide">Acidity</p>
                  <p className="font-medium text-coffee-900 capitalize">{bestMatch.acidityLevel}</p>
                </div>
                <div>
                  <p className="text-xs text-coffee-500 uppercase tracking-wide">Body</p>
                  <p className="font-medium text-coffee-900 capitalize">{bestMatch.bodyLevel}</p>
                </div>
              </div>

              {/* Popular brands */}
              {bestMatch.popularBrands && bestMatch.popularBrands.length > 0 && (
                <div className="pt-4 border-t border-coffee-100">
                  <p className="text-xs text-coffee-500 uppercase tracking-wide mb-2">
                    Where to find it
                  </p>
                  <p className="text-coffee-700">{bestMatch.popularBrands.join(', ')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Cafe order script */}
        <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <Card className="border-coffee-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Coffee className="h-5 w-5 text-coffee-600" />
                Your cafe order
              </CardTitle>
              <CardDescription>Copy this and use it next time you&apos;re at a cafe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-coffee-50 p-4 rounded-lg flex items-start justify-between gap-4">
                <p className="text-coffee-800 italic">&ldquo;{cafeOrderScript}&rdquo;</p>
                <CopyButton text={cafeOrderScript} />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Brew tips */}
        <BrewTipsCard brewTips={brewTips} />

        {/* Alternative recommendation */}
        <AlternativeCard alternative={alternative} />

        {/* Upgrade suggestion */}
        {recommendation.upgradePathSuggestion && (
          <section className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Card className="border-coffee-200 bg-coffee-50">
              <CardContent className="pt-6">
                <p className="text-coffee-700">{recommendation.upgradePathSuggestion}</p>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Cafe suggestions */}
        {showCafes && (
          <section className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <CafeList location={answers.location!} />
          </section>
        )}

        {/* Retake quiz */}
        <section className="text-center pt-8">
          <Link href="/quiz">
            <Button variant="outline" size="lg">
              Take the quiz again
            </Button>
          </Link>
        </section>
      </main>
    </div>
  );
}
