'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AnalyticsData {
  flavorPreferences: Array<{ name: string; count: number }>;
  equipment: Array<{ name: string; count: number }>;
  topRecommendations: Array<{ name: string; count: number }>;
  dailyActivity: Array<{ date: string; starts: number; completions: number }>;
}

const COLORS = ['#d08a4e', '#a15c39', '#c27543', '#824b34', '#6a3f2d'];

// Readable labels for chart data
const labelMap: Record<string, string> = {
  chocolatey: 'Chocolatey',
  fruity: 'Fruity',
  nutty: 'Nutty',
  balanced: 'Balanced',
  none: 'No equipment',
  drip: 'Drip machine',
  'french-press': 'French press',
  'pour-over': 'Pour over',
  aeropress: 'AeroPress',
  'moka-pot': 'Moka pot',
  espresso: 'Espresso',
  pods: 'Pods',
  'not-specified': 'Not specified',
  'brazilian-medium': 'Brazilian Medium',
  'colombian-classic': 'Colombian Classic',
  'ethiopian-light': 'Ethiopian Light',
  'sumatra-dark': 'Sumatran Dark',
  'italian-espresso-blend': 'Italian Espresso',
  'house-blend-medium': 'House Blend',
  'premium-pod-blend': 'Premium Pods',
};

function formatLabel(key: string): string {
  return labelMap[key] || key.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface AnalyticsChartsProps {
  data: AnalyticsData;
}

export function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  const flavorData = data.flavorPreferences.map((item) => ({
    ...item,
    name: formatLabel(item.name),
  }));

  const equipmentData = data.equipment.map((item) => ({
    ...item,
    name: formatLabel(item.name),
  }));

  const recommendationData = data.topRecommendations.map((item) => ({
    ...item,
    name: formatLabel(item.name),
  }));

  const activityData = data.dailyActivity.slice(-14).map((item) => ({
    ...item,
    date: formatDate(item.date),
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Daily Activity */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Daily Activity (Last 14 Days)</CardTitle>
          <CardDescription>Quiz starts and completions over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8c49c" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  stroke="#824b34"
                />
                <YAxis tick={{ fontSize: 12 }} stroke="#824b34" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fdf8f3',
                    border: '1px solid #e8c49c',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="starts"
                  name="Quiz Starts"
                  stroke="#d08a4e"
                  strokeWidth={2}
                  dot={{ fill: '#d08a4e' }}
                />
                <Line
                  type="monotone"
                  dataKey="completions"
                  name="Completions"
                  stroke="#a15c39"
                  strokeWidth={2}
                  dot={{ fill: '#a15c39' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Flavor Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Flavor Preferences</CardTitle>
          <CardDescription>What flavors users prefer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={flavorData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {flavorData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fdf8f3',
                    border: '1px solid #e8c49c',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Equipment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Equipment Used</CardTitle>
          <CardDescription>What equipment users have at home</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={equipmentData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e8c49c" />
                <XAxis type="number" stroke="#824b34" />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={100}
                  tick={{ fontSize: 11 }}
                  stroke="#824b34"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fdf8f3',
                    border: '1px solid #e8c49c',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="#d08a4e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Recommendations */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Top Recommendations</CardTitle>
          <CardDescription>Most frequently recommended coffees</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recommendationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8c49c" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  stroke="#824b34"
                  angle={-15}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#824b34" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fdf8f3',
                    border: '1px solid #e8c49c',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="#a15c39" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
