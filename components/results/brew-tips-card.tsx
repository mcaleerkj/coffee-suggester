import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame } from 'lucide-react';
import type { BrewTips } from '@/lib/types';

interface BrewTipsCardProps {
  brewTips: BrewTips;
}

export function BrewTipsCard({ brewTips }: BrewTipsCardProps) {
  const methodNames: Record<string, string> = {
    drip: 'Drip Coffee',
    'french-press': 'French Press',
    'pour-over': 'Pour Over',
    aeropress: 'AeroPress',
    'moka-pot': 'Moka Pot',
    espresso: 'Espresso',
    'cold-brew': 'Cold Brew',
    pods: 'Pod Machine',
  };

  return (
    <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <Card className="border-coffee-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Flame className="h-5 w-5 text-coffee-600" />
            Brewing tips for {methodNames[brewTips.method] || brewTips.method}
          </CardTitle>
          <CardDescription>Simple guidelines to get the best flavor</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-coffee-500 uppercase tracking-wide">Ratio</p>
              <p className="text-coffee-800">{brewTips.ratio}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-coffee-500 uppercase tracking-wide">Grind Size</p>
              <p className="text-coffee-800">{brewTips.grindSize}</p>
            </div>
            {brewTips.temperature && (
              <div className="space-y-1">
                <p className="text-xs text-coffee-500 uppercase tracking-wide">Water Temperature</p>
                <p className="text-coffee-800">{brewTips.temperature}</p>
              </div>
            )}
            {brewTips.brewTime && (
              <div className="space-y-1">
                <p className="text-xs text-coffee-500 uppercase tracking-wide">Brew Time</p>
                <p className="text-coffee-800">{brewTips.brewTime}</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-coffee-100">
            <p className="text-xs text-coffee-500 uppercase tracking-wide mb-2">Pro tip</p>
            <p className="text-coffee-700">{brewTips.tip}</p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
