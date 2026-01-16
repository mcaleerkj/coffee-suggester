import { Coffee } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center">
      <div className="w-16 h-16 bg-coffee-100 rounded-full flex items-center justify-center animate-pulse">
        <Coffee className="w-8 h-8 text-coffee-600" />
      </div>
      <p className="mt-4 text-coffee-600">Loading your recommendations...</p>
    </div>
  );
}
