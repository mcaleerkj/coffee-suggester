import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Coffee, ArrowRight, Sparkles, Heart, MapPin } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Coffee className="h-8 w-8 text-coffee-700" />
          <span className="font-semibold text-xl text-coffee-900">Coffee Suggester</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Steam animation decoration */}
          <div className="relative inline-block">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-2">
              <div className="w-1 h-8 bg-coffee-300/50 rounded-full animate-steam" />
              <div
                className="w-1 h-6 bg-coffee-300/50 rounded-full animate-steam"
                style={{ animationDelay: '0.3s' }}
              />
              <div
                className="w-1 h-8 bg-coffee-300/50 rounded-full animate-steam"
                style={{ animationDelay: '0.6s' }}
              />
            </div>
            <div className="w-20 h-20 bg-coffee-100 rounded-full flex items-center justify-center border-4 border-coffee-200">
              <Coffee className="w-10 h-10 text-coffee-600" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-coffee-900 leading-tight">
            Find Your Perfect Cup of Coffee
          </h1>

          <p className="text-lg md:text-xl text-coffee-700 max-w-lg mx-auto">
            Answer a few quick questions and we&apos;ll help you discover coffee that matches your
            taste. No judgment, no pretension - just great coffee.
          </p>

          <Link href="/quiz">
            <Button size="xl" className="group">
              Start the Quiz
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <p className="text-sm text-coffee-500">Takes about 2 minutes</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-coffee-100 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 text-coffee-600" />
              </div>
              <h3 className="font-semibold text-coffee-900">Personalized Picks</h3>
              <p className="text-sm text-coffee-600">
                Get recommendations based on your actual preferences, not what&apos;s trendy
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-coffee-100 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6 text-coffee-600" />
              </div>
              <h3 className="font-semibold text-coffee-900">No Coffee Snobbery</h3>
              <p className="text-sm text-coffee-600">
                Pods? Milk and sugar? No problem. We meet you where you are
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-coffee-100 rounded-full flex items-center justify-center mx-auto">
                <MapPin className="w-6 h-6 text-coffee-600" />
              </div>
              <h3 className="font-semibold text-coffee-900">Find Local Cafes</h3>
              <p className="text-sm text-coffee-600">
                Discover specialty coffee shops near you (optional)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6 text-center text-sm text-coffee-500">
        <p>Made with coffee and code</p>
      </footer>
    </div>
  );
}
