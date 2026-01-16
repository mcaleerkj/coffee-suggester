import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import type { CoffeeRecommendation } from '@/lib/types';

interface AlternativeCardProps {
  alternative: CoffeeRecommendation;
}

export function AlternativeCard({ alternative }: AlternativeCardProps) {
  return (
    <section className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
      <Card className="border-coffee-200 bg-white/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-coffee-600" />
            Also try: {alternative.name}
          </CardTitle>
          <CardDescription>A different option that might suit your taste</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-coffee-700">{alternative.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {alternative.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-coffee-100 text-coffee-700 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Quick details */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-coffee-100">
            <div>
              <p className="text-xs text-coffee-500">Roast</p>
              <p className="text-sm font-medium text-coffee-900 capitalize">
                {alternative.roastLevel}
              </p>
            </div>
            <div>
              <p className="text-xs text-coffee-500">Acidity</p>
              <p className="text-sm font-medium text-coffee-900 capitalize">
                {alternative.acidityLevel}
              </p>
            </div>
            <div>
              <p className="text-xs text-coffee-500">Body</p>
              <p className="text-sm font-medium text-coffee-900 capitalize">
                {alternative.bodyLevel}
              </p>
            </div>
          </div>

          {/* Popular brands */}
          {alternative.popularBrands && alternative.popularBrands.length > 0 && (
            <div className="text-sm text-coffee-600">
              Look for: {alternative.popularBrands.slice(0, 3).join(', ')}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
