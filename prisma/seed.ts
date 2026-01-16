import { PrismaClient } from '@prisma/client';
import { generateRecommendation } from '../lib/recommendation';
import { generateShareSlug } from '../lib/utils';

const prisma = new PrismaClient();

// Sample quiz answers for seeding test data
const sampleQuizzes = [
  {
    milkPreference: 'black',
    temperature: 'hot',
    flavorPreference: 'chocolatey',
    coffeeContext: 'home',
    equipment: 'french-press',
  },
  {
    milkPreference: 'with-milk',
    temperature: 'iced',
    flavorPreference: 'fruity',
    coffeeContext: 'cafe',
  },
  {
    milkPreference: 'sweetened',
    temperature: 'hot',
    flavorPreference: 'balanced',
    coffeeContext: 'both',
    equipment: 'drip',
  },
  {
    milkPreference: 'black',
    temperature: 'hot',
    flavorPreference: 'fruity',
    coffeeContext: 'home',
    equipment: 'pour-over',
  },
  {
    milkPreference: 'with-milk',
    temperature: 'hot',
    flavorPreference: 'chocolatey',
    coffeeContext: 'home',
    equipment: 'pods',
  },
];

// Sample analytics events for seeding
const sampleEvents = [
  { type: 'quiz_start', payload: {} },
  { type: 'quiz_start', payload: {} },
  { type: 'quiz_start', payload: {} },
  {
    type: 'quiz_complete',
    payload: {
      milkPreference: 'black',
      temperature: 'hot',
      flavorPreference: 'chocolatey',
      coffeeContext: 'home',
      equipment: 'french-press',
      recommendationId: 'brazilian-medium',
      alternativeId: 'sumatra-dark',
    },
  },
  {
    type: 'quiz_complete',
    payload: {
      milkPreference: 'with-milk',
      temperature: 'iced',
      flavorPreference: 'fruity',
      coffeeContext: 'cafe',
      recommendationId: 'ethiopian-light',
      alternativeId: 'kenyan-medium',
    },
  },
  {
    type: 'cafe_search',
    payload: {
      hasLocation: true,
      city: 'Seattle',
      resultCount: 8,
    },
  },
];

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.analyticsEvent.deleteMany();
  await prisma.result.deleteMany();
  await prisma.cafeSearchCache.deleteMany();

  console.log('Cleared existing data');

  // Seed sample results
  for (const answers of sampleQuizzes) {
    const recommendation = generateRecommendation(answers as Parameters<typeof generateRecommendation>[0]);
    const shareSlug = generateShareSlug();

    await prisma.result.create({
      data: {
        shareSlug,
        answers: JSON.stringify(answers),
        recommendation: JSON.stringify(recommendation),
      },
    });

    console.log(`Created result with slug: ${shareSlug}`);
  }

  // Seed analytics events with various timestamps over the past 7 days
  const now = new Date();
  for (let day = 0; day < 7; day++) {
    const eventsPerDay = Math.floor(Math.random() * 5) + 3;

    for (let i = 0; i < eventsPerDay; i++) {
      const eventTemplate = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
      const eventDate = new Date(now);
      eventDate.setDate(eventDate.getDate() - day);
      eventDate.setHours(Math.floor(Math.random() * 24));

      await prisma.analyticsEvent.create({
        data: {
          type: eventTemplate.type,
          payload: JSON.stringify(eventTemplate.payload),
          createdAt: eventDate,
        },
      });
    }
  }

  console.log('Seeded analytics events');

  // Count seeded data
  const resultCount = await prisma.result.count();
  const eventCount = await prisma.analyticsEvent.count();

  console.log(`\nSeeding complete!`);
  console.log(`- Results: ${resultCount}`);
  console.log(`- Analytics events: ${eventCount}`);
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
