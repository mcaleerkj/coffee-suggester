import { z } from 'zod';

// Quiz answer types
export type MilkPreference = 'black' | 'with-milk' | 'sweetened';
export type Temperature = 'hot' | 'iced' | 'both';
export type FlavorPreference = 'chocolatey' | 'fruity' | 'nutty' | 'balanced';
export type CoffeeContext = 'home' | 'cafe' | 'both';
export type Equipment =
  | 'none'
  | 'drip'
  | 'french-press'
  | 'pour-over'
  | 'aeropress'
  | 'moka-pot'
  | 'espresso'
  | 'pods';
export type AcidityTolerance = 'normal' | 'low-acidity';

// Quiz answers schema
export const QuizAnswersSchema = z.object({
  milkPreference: z.enum(['black', 'with-milk', 'sweetened']),
  temperature: z.enum(['hot', 'iced', 'both']),
  flavorPreference: z.enum(['chocolatey', 'fruity', 'nutty', 'balanced']),
  coffeeContext: z.enum(['home', 'cafe', 'both']),
  equipment: z.enum([
    'none',
    'drip',
    'french-press',
    'pour-over',
    'aeropress',
    'moka-pot',
    'espresso',
    'pods',
  ]).optional(),
  wantsCafeSuggestions: z.boolean().optional(),
  location: z.object({
    city: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
  }).optional(),
  acidityTolerance: z.enum(['normal', 'low-acidity']).optional(),
  currentOrder: z.string().optional(), // Free text for their go-to order
});

export type QuizAnswers = z.infer<typeof QuizAnswersSchema>;

// Flavor profiles for coffee recommendations
export type FlavorProfile =
  | 'chocolatey-nutty'
  | 'caramel-smooth'
  | 'fruity-bright'
  | 'bold-smoky'
  | 'sweet-dessert'
  | 'balanced-mild';

// Roast levels
export type RoastLevel = 'light' | 'medium' | 'medium-dark' | 'dark';

// Origin regions
export type OriginStyle =
  | 'latin-america'
  | 'east-africa'
  | 'indonesia'
  | 'blend'
  | 'single-origin';

// Brew methods
export type BrewMethod =
  | 'drip'
  | 'french-press'
  | 'pour-over'
  | 'aeropress'
  | 'moka-pot'
  | 'espresso'
  | 'cold-brew'
  | 'pods';

// Coffee recommendation structure
export interface CoffeeRecommendation {
  id: string;
  name: string;
  description: string;
  flavorProfile: FlavorProfile;
  roastLevel: RoastLevel;
  originStyle: OriginStyle;
  suggestedBrewMethods: BrewMethod[];
  tags: string[];
  acidityLevel: 'low' | 'medium' | 'high';
  bodyLevel: 'light' | 'medium' | 'full';
  popularBrands?: string[];
}

// Brew tips structure
export interface BrewTips {
  method: BrewMethod;
  ratio: string; // e.g., "1:15 coffee to water"
  grindSize: string;
  temperature?: string;
  brewTime?: string;
  tip: string;
}

// Full recommendation output
export interface RecommendationOutput {
  bestMatch: CoffeeRecommendation;
  alternative: CoffeeRecommendation;
  explanation: string;
  confidenceStatement: string;
  brewTips: BrewTips;
  cafeOrderScript: string;
  upgradePathSuggestion?: string;
}

// Cafe data structure
export interface Cafe {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distance?: number; // in meters
  openingHours?: string;
  isOpenNow?: boolean;
  osmLink: string;
  tags: string[];
}

// Cafe search result
export interface CafeSearchResult {
  cafes: Cafe[];
  query: string;
  center: { lat: number; lng: number };
  radius: number;
  totalFound: number;
}

// Analytics event types
export type AnalyticsEventType =
  | 'quiz_start'
  | 'quiz_complete'
  | 'recommendation_view'
  | 'cafe_search'
  | 'share_link_created'
  | 'share_link_viewed';

export interface AnalyticsPayload {
  quizStart?: { timestamp: string };
  quizComplete?: {
    milkPreference: MilkPreference;
    temperature: Temperature;
    flavorPreference: FlavorPreference;
    coffeeContext: CoffeeContext;
    equipment?: Equipment;
  };
  recommendationView?: {
    recommendationId: string;
    alternativeId: string;
  };
  cafeSearch?: {
    hasLocation: boolean;
    resultCount: number;
  };
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Share result structure
export interface SharedResult {
  id: string;
  shareSlug: string;
  answers: QuizAnswers;
  recommendation: RecommendationOutput;
  createdAt: string;
}
