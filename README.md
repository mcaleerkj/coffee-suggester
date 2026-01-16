# Coffee Suggester

A friendly, fast web app that helps casual coffee drinkers discover the perfect coffee type, flavor, format, beans, brew methods, and nearby cafe suggestions.

## Features

- **Guided Coffee Quiz**: 3-5 adaptive questions that feel like chatting with a knowledgeable barista
- **Personalized Recommendations**: Deterministic, explainable recommendations based on your preferences
- **Brew Tips**: Simple, practical brewing guides for any equipment
- **Cafe Finder**: Discover specialty coffee shops near you (powered by OpenStreetMap)
- **Shareable Results**: Get a unique link to share your coffee profile
- **Privacy-First Analytics**: Admin dashboard with aggregated, anonymous data only

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API routes
- **Database**: SQLite (local) / PostgreSQL (production) via Prisma
- **Maps**: OpenStreetMap Nominatim + Overpass API (free, no key required)
- **Testing**: Vitest

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Local Development

```bash
# Clone the repository
git clone <repository-url>
cd coffee-suggester

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Generate Prisma client and create database
npm run db:generate
npm run db:push

# Seed the database (optional)
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

| Variable                 | Description                         | Required | Default                 |
| ------------------------ | ----------------------------------- | -------- | ----------------------- |
| `DATABASE_URL`           | Database connection string          | Yes      | `file:./dev.db`         |
| `ADMIN_PASSWORD`         | Password for `/admin` dashboard     | Yes      | -                       |
| `NEXT_PUBLIC_APP_URL`    | Public URL for share links          | No       | `http://localhost:3000` |
| `GOOGLE_PLACES_API_KEY`  | Optional Google Places API key      | No       | -                       |
| `CAFE_SEARCH_RATE_LIMIT` | Requests per minute for cafe search | No       | `30`                    |
| `CAFE_CACHE_DURATION`    | Cache duration in seconds           | No       | `3600`                  |

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests once (CI mode)
npm run test:run
```

## Database

### SQLite (Default for Development)

SQLite is used by default for local development. No additional setup required.

```bash
# Apply schema
npm run db:push

# Open Prisma Studio to view data
npm run db:studio
```

### PostgreSQL (Production)

For production, switch to PostgreSQL:

1. Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Update `DATABASE_URL` in your environment:

```
DATABASE_URL="postgresql://user:password@localhost:5432/coffee_suggester?schema=public"
```

3. Run migrations:

```bash
npm run db:migrate
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

**Important**: For Vercel deployment with SQLite, you'll need to use PostgreSQL instead (Neon, Supabase, or Railway) since Vercel's serverless functions don't persist file storage.

Recommended setup:

- Database: [Neon](https://neon.tech/) (free tier available)
- Set `DATABASE_URL` in Vercel to your Neon connection string

### Docker

#### With PostgreSQL (Recommended for Production)

```bash
# Build and run with PostgreSQL
docker-compose up -d

# View logs
docker-compose logs -f app
```

#### With SQLite (Simpler, for testing)

```bash
# Build and run with SQLite
docker-compose -f docker-compose.sqlite.yml up -d
```

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
coffee-suggester/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── quiz/              # Quiz flow
│   └── results/[slug]/    # Results page
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   ├── quiz/             # Quiz components
│   ├── results/          # Results page components
│   └── ui/               # shadcn/ui components
├── lib/                   # Core logic
│   ├── cafes/            # Cafe provider implementations
│   │   └── providers/    # OSM, Google Places providers
│   └── recommendation/   # Recommendation engine
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## How the Recommendation Engine Works

The recommendation engine uses a scoring system to match coffee profiles to user preferences:

### Scoring Factors

1. **Flavor Match (40 points)**: Maps user flavor preferences to compatible coffee flavor profiles
   - Chocolatey → chocolatey-nutty, sweet-dessert, bold-smoky
   - Fruity → fruity-bright, balanced-mild
   - Nutty → chocolatey-nutty, caramel-smooth
   - Balanced → balanced-mild, caramel-smooth

2. **Acidity Match (25 points)**: Low-acidity preference prioritizes coffees with low acidity levels

3. **Brew Method Match (20 points)**: Ensures the recommended coffee works with your equipment

4. **Milk Compatibility (15 points)**: Full-bodied, darker roasts score higher for milk drinkers

### Coffee Profiles

The engine includes 13+ curated coffee profiles covering:

- Latin American (Brazilian, Colombian, Guatemalan, Costa Rican)
- East African (Ethiopian, Kenyan)
- Indonesian (Sumatran)
- Blends (Italian Espresso, French Roast, House Blend)
- Specialty options (Cold Brew Blend, Premium Pods)

Each profile includes:

- Flavor notes and characteristics
- Roast level
- Acidity and body levels
- Compatible brew methods
- Popular brands for easy purchasing

## Admin Dashboard

Access the admin dashboard at `/admin` using your `ADMIN_PASSWORD`.

Features:

- Quiz completion metrics
- Conversion rates
- Popular flavor preferences
- Equipment usage breakdown
- Top recommendations
- Daily activity charts

## API Endpoints

### `POST /api/quiz/submit`

Submit quiz answers and get recommendations.

### `GET /api/cafes`

Search for nearby cafes.

- `lat` & `lng`: Coordinates
- `city`: City name (will be geocoded)
- `radius`: Search radius in meters (default: 2000)
- `limit`: Max results (default: 10)

### `POST /api/analytics/track`

Track analytics events.

### `GET /api/admin/analytics`

Get analytics data (requires `Authorization: Bearer <ADMIN_PASSWORD>` header).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

## License

MIT
