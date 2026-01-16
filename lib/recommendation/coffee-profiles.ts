import type { CoffeeRecommendation } from '@/lib/types';

/**
 * Curated coffee profiles used by the recommendation engine.
 * Each profile represents a distinct coffee experience with clear flavor characteristics.
 */
export const coffeeProfiles: CoffeeRecommendation[] = [
  // Chocolatey/Nutty profiles
  {
    id: 'brazilian-medium',
    name: 'Brazilian Medium Roast',
    description:
      'A smooth, approachable coffee with notes of chocolate, hazelnut, and a hint of caramel. Perfect for those who enjoy a comforting, classic coffee experience.',
    flavorProfile: 'chocolatey-nutty',
    roastLevel: 'medium',
    originStyle: 'latin-america',
    suggestedBrewMethods: ['drip', 'french-press', 'pour-over', 'cold-brew'],
    tags: ['smooth', 'nutty', 'beginner-friendly', 'versatile'],
    acidityLevel: 'low',
    bodyLevel: 'medium',
    popularBrands: ['Lavazza', 'Illy', "Peet's"],
  },
  {
    id: 'colombian-classic',
    name: 'Colombian Classic',
    description:
      "Well-balanced with sweet caramel notes and a clean finish. Colombia's high altitude produces consistently excellent coffee that works beautifully with or without milk.",
    flavorProfile: 'caramel-smooth',
    roastLevel: 'medium',
    originStyle: 'latin-america',
    suggestedBrewMethods: ['drip', 'pour-over', 'aeropress', 'espresso'],
    tags: ['balanced', 'sweet', 'versatile', 'crowd-pleaser'],
    acidityLevel: 'medium',
    bodyLevel: 'medium',
    popularBrands: ['Juan Valdez', 'Starbucks Colombia', 'Counter Culture'],
  },
  {
    id: 'sumatra-dark',
    name: 'Sumatran Dark Roast',
    description:
      'Earthy, full-bodied, and bold with low acidity. Notes of dark chocolate, cedar, and a syrupy mouthfeel. Ideal for those who want their coffee strong and robust.',
    flavorProfile: 'bold-smoky',
    roastLevel: 'dark',
    originStyle: 'indonesia',
    suggestedBrewMethods: ['french-press', 'moka-pot', 'espresso', 'cold-brew'],
    tags: ['bold', 'earthy', 'low-acid', 'intense'],
    acidityLevel: 'low',
    bodyLevel: 'full',
    popularBrands: ['Starbucks Sumatra', "Peet's Sumatra", 'Blue Bottle'],
  },
  // Fruity/Bright profiles
  {
    id: 'ethiopian-light',
    name: 'Ethiopian Light Roast',
    description:
      'Vibrant and complex with berry notes, floral aromatics, and a tea-like body. Ethiopia is the birthplace of coffee, and its natural processing creates uniquely fruity flavors.',
    flavorProfile: 'fruity-bright',
    roastLevel: 'light',
    originStyle: 'east-africa',
    suggestedBrewMethods: ['pour-over', 'aeropress', 'drip'],
    tags: ['fruity', 'floral', 'complex', 'specialty'],
    acidityLevel: 'high',
    bodyLevel: 'light',
    popularBrands: ['Intelligentsia', 'Stumptown', 'Counter Culture'],
  },
  {
    id: 'kenyan-medium',
    name: 'Kenyan Medium Roast',
    description:
      'Bright and juicy with notes of blackcurrant, citrus, and a wine-like acidity. Kenyan coffees are prized for their bold, complex fruit character.',
    flavorProfile: 'fruity-bright',
    roastLevel: 'medium',
    originStyle: 'east-africa',
    suggestedBrewMethods: ['pour-over', 'aeropress', 'drip'],
    tags: ['bright', 'complex', 'citrus', 'specialty'],
    acidityLevel: 'high',
    bodyLevel: 'medium',
    popularBrands: ['Blue Bottle', 'Verve', 'Onyx Coffee Lab'],
  },
  // Sweet/Dessert profiles
  {
    id: 'guatemalan-medium-dark',
    name: 'Guatemalan Medium-Dark',
    description:
      'Sweet and rich with notes of brown sugar, cocoa, and a hint of spice. The volcanic soil of Guatemala creates coffees with exceptional sweetness.',
    flavorProfile: 'sweet-dessert',
    roastLevel: 'medium-dark',
    originStyle: 'latin-america',
    suggestedBrewMethods: ['drip', 'french-press', 'espresso', 'moka-pot'],
    tags: ['sweet', 'rich', 'dessert-like', 'comforting'],
    acidityLevel: 'low',
    bodyLevel: 'full',
    popularBrands: ['Starbucks Guatemala', 'La Colombe', 'Intelligentsia'],
  },
  {
    id: 'costa-rican-honey',
    name: 'Costa Rican Honey Process',
    description:
      'Naturally sweet with honey-like sweetness, stone fruit notes, and a silky body. Honey processing leaves some fruit on the bean during drying, creating extra sweetness.',
    flavorProfile: 'sweet-dessert',
    roastLevel: 'medium',
    originStyle: 'latin-america',
    suggestedBrewMethods: ['pour-over', 'aeropress', 'drip'],
    tags: ['sweet', 'honey', 'fruity', 'smooth'],
    acidityLevel: 'medium',
    bodyLevel: 'medium',
    popularBrands: ['Onyx', 'Heart Coffee', 'Camber'],
  },
  // Bold/Smoky profiles
  {
    id: 'italian-espresso-blend',
    name: 'Italian Espresso Blend',
    description:
      'Dark and bold with notes of dark chocolate, roasted nuts, and a pleasant bitterness. Designed specifically for espresso but works great in milk drinks.',
    flavorProfile: 'bold-smoky',
    roastLevel: 'dark',
    originStyle: 'blend',
    suggestedBrewMethods: ['espresso', 'moka-pot', 'french-press'],
    tags: ['bold', 'espresso', 'milk-friendly', 'classic'],
    acidityLevel: 'low',
    bodyLevel: 'full',
    popularBrands: ['Lavazza', 'Illy', 'Segafredo'],
  },
  {
    id: 'french-roast',
    name: 'French Roast',
    description:
      'Deeply roasted with smoky, bittersweet chocolate notes and minimal acidity. A classic choice for those who prefer their coffee dark and intense.',
    flavorProfile: 'bold-smoky',
    roastLevel: 'dark',
    originStyle: 'blend',
    suggestedBrewMethods: ['french-press', 'drip', 'cold-brew'],
    tags: ['smoky', 'bold', 'dark', 'intense'],
    acidityLevel: 'low',
    bodyLevel: 'full',
    popularBrands: ["Peet's", 'Starbucks French Roast', 'Community Coffee'],
  },
  // Balanced/Mild profiles
  {
    id: 'house-blend-medium',
    name: 'Classic House Blend',
    description:
      'A well-rounded everyday coffee that hits all the right notes. Balanced sweetness, mild acidity, and approachable flavor make this perfect for any time of day.',
    flavorProfile: 'balanced-mild',
    roastLevel: 'medium',
    originStyle: 'blend',
    suggestedBrewMethods: ['drip', 'pour-over', 'french-press', 'cold-brew', 'pods'],
    tags: ['balanced', 'everyday', 'approachable', 'versatile'],
    acidityLevel: 'medium',
    bodyLevel: 'medium',
    popularBrands: ['Starbucks Pike Place', "Dunkin' Original", 'Folgers'],
  },
  {
    id: 'breakfast-blend',
    name: 'Light Breakfast Blend',
    description:
      'Bright and lively with a lighter body - perfect for mornings. Clean citrus notes with a mild sweetness that wakes you up without overwhelming your palate.',
    flavorProfile: 'balanced-mild',
    roastLevel: 'light',
    originStyle: 'blend',
    suggestedBrewMethods: ['drip', 'pour-over', 'aeropress'],
    tags: ['light', 'morning', 'bright', 'clean'],
    acidityLevel: 'medium',
    bodyLevel: 'light',
    popularBrands: ['Green Mountain', 'Starbucks Blonde', "Peet's"],
  },
  // Cold brew specific
  {
    id: 'cold-brew-concentrate',
    name: 'Cold Brew Blend',
    description:
      'Specially selected for cold brewing - smooth, sweet, and never bitter. Low acidity and chocolatey notes shine when brewed cold for 12-24 hours.',
    flavorProfile: 'chocolatey-nutty',
    roastLevel: 'medium-dark',
    originStyle: 'blend',
    suggestedBrewMethods: ['cold-brew'],
    tags: ['cold-brew', 'smooth', 'low-acid', 'sweet'],
    acidityLevel: 'low',
    bodyLevel: 'medium',
    popularBrands: ['Stumptown Cold Brew', 'Chameleon', 'La Colombe'],
  },
  // Pod-friendly
  {
    id: 'premium-pod-blend',
    name: 'Premium Pod Selection',
    description:
      'Quality coffee in convenient pod form. Look for pods from specialty roasters that use freshly roasted beans. Nespresso Original and Keurig K-cups both have excellent options.',
    flavorProfile: 'balanced-mild',
    roastLevel: 'medium',
    originStyle: 'blend',
    suggestedBrewMethods: ['pods'],
    tags: ['convenient', 'pods', 'quick', 'consistent'],
    acidityLevel: 'medium',
    bodyLevel: 'medium',
    popularBrands: ['Nespresso', "Peet's K-Cups", 'Lavazza Pods'],
  },
];

/**
 * Get a coffee profile by ID
 */
export function getCoffeeProfile(id: string): CoffeeRecommendation | undefined {
  return coffeeProfiles.find((profile) => profile.id === id);
}

/**
 * Get all profiles matching certain criteria
 */
export function getProfilesByFlavorProfile(
  flavorProfile: CoffeeRecommendation['flavorProfile']
): CoffeeRecommendation[] {
  return coffeeProfiles.filter((profile) => profile.flavorProfile === flavorProfile);
}

export function getProfilesByRoastLevel(
  roastLevel: CoffeeRecommendation['roastLevel']
): CoffeeRecommendation[] {
  return coffeeProfiles.filter((profile) => profile.roastLevel === roastLevel);
}

export function getLowAcidityProfiles(): CoffeeRecommendation[] {
  return coffeeProfiles.filter((profile) => profile.acidityLevel === 'low');
}
