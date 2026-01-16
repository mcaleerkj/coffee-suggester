'use client';

import { useState, useEffect } from 'react';
import { Coffee, TrendingUp, Users, MapPin, RefreshCw, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AnalyticsCharts } from '@/components/admin/analytics-charts';

interface AnalyticsData {
  summary: {
    quizStarts: number;
    quizCompletions: number;
    conversionRate: string;
    cafeSearches: number;
    totalResults: number;
  };
  flavorPreferences: Array<{ name: string; count: number }>;
  equipment: Array<{ name: string; count: number }>;
  topRecommendations: Array<{ name: string; count: number }>;
  dailyActivity: Array<{ date: string; starts: number; completions: number }>;
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyticsData | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/analytics', {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });

      if (response.status === 401) {
        setError('Invalid password');
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const analyticsData = await response.json();
      setData(analyticsData);
      setIsAuthenticated(true);
    } catch (err) {
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!isAuthenticated) return;
    setLoading(true);

    try {
      const response = await fetch('/api/admin/analytics', {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });

      if (!response.ok) throw new Error('Failed to refresh');

      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (err) {
      setError('Failed to refresh analytics');
    } finally {
      setLoading(false);
    }
  };

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-coffee-600" />
            </div>
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>Enter the admin password to view analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button type="submit" className="w-full" disabled={loading || !password}>
                {loading ? 'Loading...' : 'View Analytics'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-cream-100">
      {/* Header */}
      <header className="bg-white border-b border-coffee-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Coffee className="h-6 w-6 text-coffee-700" />
            <h1 className="text-xl font-semibold text-coffee-900">Admin Dashboard</h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Summary cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-coffee-500">Quiz Starts</p>
                  <p className="text-3xl font-bold text-coffee-900">
                    {data?.summary.quizStarts || 0}
                  </p>
                </div>
                <div className="w-10 h-10 bg-coffee-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-coffee-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-coffee-500">Completions</p>
                  <p className="text-3xl font-bold text-coffee-900">
                    {data?.summary.quizCompletions || 0}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-coffee-500">Conversion Rate</p>
                  <p className="text-3xl font-bold text-coffee-900">
                    {data?.summary.conversionRate || 0}%
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-coffee-500">Cafe Searches</p>
                  <p className="text-3xl font-bold text-coffee-900">
                    {data?.summary.cafeSearches || 0}
                  </p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Charts */}
        {data && <AnalyticsCharts data={data} />}
      </main>
    </div>
  );
}
