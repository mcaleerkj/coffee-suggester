import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'], variable: '--font-geist-sans' });

export const metadata: Metadata = {
  title: 'Coffee Suggester - Find Your Perfect Cup',
  description:
    'Discover the best coffee type, flavor, and brew method for you. Take our quick quiz and get personalized recommendations from a friendly barista.',
  keywords: ['coffee', 'recommendation', 'brew', 'espresso', 'latte', 'cafe', 'beans'],
  authors: [{ name: 'Coffee Suggester' }],
  openGraph: {
    title: 'Coffee Suggester - Find Your Perfect Cup',
    description: 'Discover your ideal coffee with our personalized quiz',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Coffee Suggester',
    description: 'Find your perfect coffee match',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-cream-100 antialiased">
        <main className="relative">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
