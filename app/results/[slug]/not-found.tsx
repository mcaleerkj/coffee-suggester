import Link from 'next/link';
import { Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 bg-coffee-100 rounded-full flex items-center justify-center mb-6">
        <Coffee className="w-8 h-8 text-coffee-600" />
      </div>

      <h1 className="text-2xl font-bold text-coffee-900 mb-2">Results not found</h1>

      <p className="text-coffee-600 mb-8 max-w-md">
        We couldn&apos;t find those coffee recommendations. The link may have expired or been
        entered incorrectly.
      </p>

      <Link href="/quiz">
        <Button size="lg">Take the quiz</Button>
      </Link>

      <p className="text-sm text-coffee-500 mt-4">
        Or{' '}
        <Link href="/" className="underline hover:text-coffee-700">
          return home
        </Link>
      </p>
    </div>
  );
}
