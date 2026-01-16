'use client';

import { useState, useEffect } from 'react';
import { MapPin, ExternalLink, Coffee, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Cafe } from '@/lib/types';
import { formatDistance } from '@/lib/utils';

interface CafeListProps {
  location: {
    city?: string;
    lat?: number;
    lng?: number;
  };
}

export function CafeList({ location }: CafeListProps) {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCafes = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (location.lat && location.lng) {
        params.set('lat', location.lat.toString());
        params.set('lng', location.lng.toString());
      } else if (location.city) {
        params.set('city', location.city);
      }

      const response = await fetch(`/api/cafes?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch cafes');
      }

      const data = await response.json();
      setCafes(data.cafes || []);
    } catch (err) {
      setError('Unable to load nearby cafes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCafes();
  }, [location]);

  if (loading) {
    return (
      <Card className="border-coffee-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-coffee-600" />
            Finding cafes near you...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-coffee-100 rounded-lg animate-shimmer" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-coffee-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-coffee-600" />
            Nearby cafes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-coffee-600 mb-4">{error}</p>
            <Button variant="outline" onClick={fetchCafes}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (cafes.length === 0) {
    return (
      <Card className="border-coffee-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-coffee-600" />
            Nearby cafes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Coffee className="h-12 w-12 text-coffee-300 mx-auto mb-4" />
            <p className="text-coffee-600">
              No cafes found in this area. Try searching a different location.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-coffee-200">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5 text-coffee-600" />
          Nearby cafes
        </CardTitle>
        <CardDescription>
          {location.city
            ? `Specialty coffee shops near ${location.city}`
            : 'Specialty coffee shops near you'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {cafes.map((cafe) => (
            <a
              key={cafe.id}
              href={cafe.osmLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-lg border border-coffee-100 hover:border-coffee-200 hover:bg-coffee-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-medium text-coffee-900 flex items-center gap-2">
                    {cafe.name}
                    <ExternalLink className="h-3 w-3 text-coffee-400" />
                  </h4>
                  <p className="text-sm text-coffee-600">{cafe.address}</p>
                  {cafe.tags.length > 0 && (
                    <div className="flex gap-2 pt-1">
                      {cafe.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 bg-coffee-100 text-coffee-600 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {cafe.distance && (
                  <span className="text-sm text-coffee-500 whitespace-nowrap">
                    {formatDistance(cafe.distance)}
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
