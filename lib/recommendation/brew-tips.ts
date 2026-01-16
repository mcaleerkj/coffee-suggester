import type { BrewMethod, BrewTips } from '@/lib/types';

/**
 * Brew tips for each method. These are practical, beginner-friendly guides.
 * Ratios are expressed as coffee:water (e.g., 1:15 means 1g coffee per 15g water)
 */
export const brewTipsData: Record<BrewMethod, BrewTips> = {
  drip: {
    method: 'drip',
    ratio: '1:15 to 1:17 (about 2 tablespoons per 6oz cup)',
    grindSize: 'Medium - like coarse sand',
    temperature: '195-205°F (90-96°C)',
    brewTime: '4-6 minutes',
    tip: 'Use filtered water and clean your machine monthly with vinegar. Fresh beans make the biggest difference.',
  },
  'french-press': {
    method: 'french-press',
    ratio: '1:12 to 1:15 (about 2 tablespoons per 6oz cup)',
    grindSize: 'Coarse - like sea salt',
    temperature: '200°F (93°C) - just off boiling',
    brewTime: '4 minutes steep, then press slowly',
    tip: 'Don\'t press too hard or fast - let the grounds settle and press gently to avoid bitter sediment.',
  },
  'pour-over': {
    method: 'pour-over',
    ratio: '1:15 to 1:17 (about 22g coffee for 350ml water)',
    grindSize: 'Medium-fine - like table salt',
    temperature: '200-205°F (93-96°C)',
    brewTime: '2:30-3:30 total',
    tip: 'Start with a 30-second bloom (wet grounds, wait) before your main pour. Pour in slow circles.',
  },
  aeropress: {
    method: 'aeropress',
    ratio: '1:12 to 1:15 (about 15-18g for one cup)',
    grindSize: 'Fine to medium-fine',
    temperature: '175-185°F (80-85°C) for a smoother cup',
    brewTime: '1-2 minutes total',
    tip: 'The AeroPress is very forgiving. Experiment with inverted method and different steep times to find your taste.',
  },
  'moka-pot': {
    method: 'moka-pot',
    ratio: 'Fill the basket loosely, don\'t tamp',
    grindSize: 'Fine - but not espresso fine',
    temperature: 'Start with pre-heated water for less bitterness',
    brewTime: '4-5 minutes on medium-low heat',
    tip: 'Remove from heat as soon as you hear gurgling. Cooling the bottom under cold water stops extraction and prevents bitterness.',
  },
  espresso: {
    method: 'espresso',
    ratio: '1:2 (18g in, 36g out is a good start)',
    grindSize: 'Very fine - like powdered sugar',
    temperature: '200-205°F (93-96°C)',
    brewTime: '25-30 seconds for the shot',
    tip: 'If your shot runs too fast, grind finer. Too slow and bitter? Grind coarser. Small adjustments make big differences.',
  },
  'cold-brew': {
    method: 'cold-brew',
    ratio: '1:8 for concentrate (dilute 1:1), 1:15 for ready-to-drink',
    grindSize: 'Very coarse - like raw sugar',
    temperature: 'Room temp or refrigerated',
    brewTime: '12-24 hours',
    tip: 'Longer isn\'t always better. 12-16 hours gives you smooth sweetness without over-extraction.',
  },
  pods: {
    method: 'pods',
    ratio: 'Pre-measured - one pod per cup',
    grindSize: 'Pre-ground in the pod',
    tip: 'Look for pods from specialty roasters (Nespresso compatible or quality K-cups). Store pods in a cool, dark place and check roast dates.',
  },
};

/**
 * Get brew tips for a specific method
 */
export function getBrewTips(method: BrewMethod): BrewTips {
  return brewTipsData[method];
}

/**
 * Get a simplified tip for display
 */
export function getQuickTip(method: BrewMethod): string {
  return brewTipsData[method].tip;
}

/**
 * Get the best brew method for a coffee context
 */
export function suggestBrewMethod(
  equipment: string | undefined,
  temperature: string
): BrewMethod {
  // If they want iced, suggest cold brew if no equipment, otherwise their equipment
  if (temperature === 'iced') {
    if (!equipment || equipment === 'none') {
      return 'cold-brew';
    }
  }

  // Map equipment to brew method
  const equipmentToMethod: Record<string, BrewMethod> = {
    none: 'drip',
    drip: 'drip',
    'french-press': 'french-press',
    'pour-over': 'pour-over',
    aeropress: 'aeropress',
    'moka-pot': 'moka-pot',
    espresso: 'espresso',
    pods: 'pods',
  };

  return equipment ? (equipmentToMethod[equipment] || 'drip') : 'drip';
}
