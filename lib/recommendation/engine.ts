import type {
  QuizAnswers,
  CoffeeRecommendation,
  RecommendationOutput,
  BrewMethod,
  FlavorProfile,
} from '@/lib/types';
import { coffeeProfiles } from './coffee-profiles';
import { getBrewTips, suggestBrewMethod } from './brew-tips';

/**
 * Scoring weights for different factors
 * Higher weight = more important in the final score
 */
const WEIGHTS = {
  flavorMatch: 40,
  acidityMatch: 25,
  brewMethodMatch: 20,
  milkCompatibility: 15,
};

/**
 * Maps user flavor preference to matching flavor profiles
 */
const flavorPreferenceMapping: Record<string, FlavorProfile[]> = {
  chocolatey: ['chocolatey-nutty', 'sweet-dessert', 'bold-smoky'],
  fruity: ['fruity-bright', 'balanced-mild'],
  nutty: ['chocolatey-nutty', 'caramel-smooth', 'balanced-mild'],
  balanced: ['balanced-mild', 'caramel-smooth', 'chocolatey-nutty'],
};

/**
 * Score a coffee profile against user answers
 * Returns a score from 0-100
 */
function scoreProfile(profile: CoffeeRecommendation, answers: QuizAnswers): number {
  let score = 0;

  // Flavor match (40 points max)
  const preferredFlavors = flavorPreferenceMapping[answers.flavorPreference] || [];
  if (preferredFlavors.includes(profile.flavorProfile)) {
    // Primary match gets full points, secondary matches get partial
    const matchIndex = preferredFlavors.indexOf(profile.flavorProfile);
    score += WEIGHTS.flavorMatch - matchIndex * 10;
  }

  // Acidity match (25 points max)
  if (answers.acidityTolerance === 'low-acidity') {
    if (profile.acidityLevel === 'low') {
      score += WEIGHTS.acidityMatch;
    } else if (profile.acidityLevel === 'medium') {
      score += WEIGHTS.acidityMatch * 0.5;
    }
  } else {
    // Normal acidity tolerance - slight preference for medium
    if (profile.acidityLevel === 'medium') {
      score += WEIGHTS.acidityMatch;
    } else {
      score += WEIGHTS.acidityMatch * 0.7;
    }
  }

  // Brew method match (20 points max)
  const userBrewMethod = suggestBrewMethod(answers.equipment, answers.temperature);
  if (profile.suggestedBrewMethods.includes(userBrewMethod)) {
    score += WEIGHTS.brewMethodMatch;
  } else if (profile.suggestedBrewMethods.length > 3) {
    // Versatile coffees get partial credit
    score += WEIGHTS.brewMethodMatch * 0.5;
  }

  // Milk compatibility (15 points max)
  if (answers.milkPreference === 'with-milk' || answers.milkPreference === 'sweetened') {
    // Darker roasts and full-bodied coffees work better with milk
    if (profile.bodyLevel === 'full' || profile.roastLevel === 'dark') {
      score += WEIGHTS.milkCompatibility;
    } else if (profile.bodyLevel === 'medium') {
      score += WEIGHTS.milkCompatibility * 0.7;
    } else {
      score += WEIGHTS.milkCompatibility * 0.4;
    }
  } else {
    // Black coffee drinkers - flavor clarity matters more
    if (profile.bodyLevel === 'light' || profile.bodyLevel === 'medium') {
      score += WEIGHTS.milkCompatibility;
    } else {
      score += WEIGHTS.milkCompatibility * 0.6;
    }
  }

  // Temperature bonus
  if (answers.temperature === 'iced' && profile.suggestedBrewMethods.includes('cold-brew')) {
    score += 5;
  }

  // Pod preference bonus
  if (answers.equipment === 'pods' && profile.suggestedBrewMethods.includes('pods')) {
    score += 10;
  }

  return Math.min(100, Math.round(score));
}

/**
 * Generate an explanation for why this coffee matches
 */
function generateExplanation(
  profile: CoffeeRecommendation,
  answers: QuizAnswers,
  score: number
): string {
  const parts: string[] = [];

  // Flavor explanation
  if (answers.flavorPreference === 'chocolatey') {
    if (profile.flavorProfile === 'chocolatey-nutty' || profile.flavorProfile === 'sweet-dessert') {
      parts.push('its rich chocolate and caramel notes match your taste perfectly');
    }
  } else if (answers.flavorPreference === 'fruity') {
    if (profile.flavorProfile === 'fruity-bright') {
      parts.push("its bright, fruity character is exactly what you're looking for");
    }
  } else if (answers.flavorPreference === 'balanced') {
    parts.push('its well-rounded flavor profile offers something for everyone');
  }

  // Milk compatibility
  if (answers.milkPreference === 'with-milk' && profile.bodyLevel === 'full') {
    parts.push('its full body stands up beautifully to milk');
  } else if (answers.milkPreference === 'black' && profile.acidityLevel !== 'high') {
    parts.push('its smooth character shines when enjoyed black');
  }

  // Acidity note
  if (answers.acidityTolerance === 'low-acidity' && profile.acidityLevel === 'low') {
    parts.push("it's gentle on the stomach with low acidity");
  }

  // Equipment match
  if (answers.equipment === 'pods') {
    parts.push('quality pod options make this convenient without sacrificing taste');
  }

  // Default if no specific reasons
  if (parts.length === 0) {
    parts.push('its balanced profile works well with your preferences');
  }

  const explanation = parts.length > 1 ? parts.slice(0, 2).join(', and ') : parts[0];

  return `We recommend this because ${explanation}.`;
}

/**
 * Generate confidence statement based on match score
 */
function generateConfidenceStatement(score: number, profile: CoffeeRecommendation): string {
  if (score >= 80) {
    return `This is a strong match if you like ${profile.tags.slice(0, 2).join(', ')} coffees.`;
  } else if (score >= 60) {
    return `This is a good fit for your preferences - ${profile.tags[0]} and approachable.`;
  } else {
    return `This is worth trying - it might introduce you to new flavors you\'ll enjoy.`;
  }
}

/**
 * Generate cafe order script based on recommendation and preferences
 */
function generateCafeOrderScript(profile: CoffeeRecommendation, answers: QuizAnswers): string {
  const parts: string[] = ['Can I get'];

  // Size (default to medium)
  parts.push('a medium');

  // Temperature
  if (answers.temperature === 'iced') {
    parts.push('iced');
  }

  // Determine drink type based on context and preferences
  if (answers.coffeeContext === 'cafe' || answers.coffeeContext === 'both') {
    if (answers.equipment === 'espresso' || profile.roastLevel === 'dark') {
      if (answers.milkPreference === 'with-milk') {
        parts.push('latte');
      } else if (answers.milkPreference === 'sweetened') {
        parts.push('vanilla latte');
      } else {
        parts.push('americano');
      }
    } else {
      if (answers.temperature === 'iced') {
        parts.push('cold brew');
      } else {
        parts.push('drip coffee');
      }
    }
  } else {
    // Home context ordering at a cafe
    parts.push('drip coffee');
  }

  // Milk preference
  if (answers.milkPreference === 'with-milk') {
    parts.push('with a splash of oat milk');
  } else if (answers.milkPreference === 'sweetened') {
    parts.push('with oat milk and a pump of vanilla');
  } else if (answers.milkPreference === 'black') {
    parts.push('black');
  }

  // Room for milk if black but they might want to add later
  if (answers.milkPreference === 'black' && answers.temperature === 'hot') {
    parts.push('- no room needed');
  }

  return parts.join(' ') + '?';
}

/**
 * Generate upgrade path suggestion for convenience users
 */
function generateUpgradeSuggestion(answers: QuizAnswers): string | undefined {
  if (answers.equipment === 'pods') {
    return "When you're ready to level up: try a simple pour-over setup (about $30). Same convenience, more flavor control, and your coffee will taste noticeably fresher.";
  }
  if (answers.equipment === 'none') {
    return 'Want to start making great coffee at home? A French press ($20-30) is foolproof and makes excellent coffee with minimal effort.';
  }
  if (answers.equipment === 'drip') {
    return 'Upgrade tip: buying whole beans and grinding them fresh makes your drip coffee taste dramatically better. A basic burr grinder costs around $30-50.';
  }
  return undefined;
}

/**
 * Main recommendation engine function
 * Takes quiz answers and returns the best match + alternative
 */
export function generateRecommendation(answers: QuizAnswers): RecommendationOutput {
  // Score all profiles
  const scoredProfiles = coffeeProfiles.map((profile) => ({
    profile,
    score: scoreProfile(profile, answers),
  }));

  // Sort by score descending
  scoredProfiles.sort((a, b) => b.score - a.score);

  // Get best match and alternative
  const bestMatch = scoredProfiles[0];

  // Find an alternative that's different enough to be interesting
  // Prefer a different flavor profile or roast level
  let alternative = scoredProfiles[1];
  for (let i = 1; i < Math.min(5, scoredProfiles.length); i++) {
    const candidate = scoredProfiles[i];
    if (
      candidate.profile.flavorProfile !== bestMatch.profile.flavorProfile ||
      candidate.profile.roastLevel !== bestMatch.profile.roastLevel
    ) {
      alternative = candidate;
      break;
    }
  }

  // Determine brew method
  const brewMethod: BrewMethod = suggestBrewMethod(answers.equipment, answers.temperature);

  return {
    bestMatch: bestMatch.profile,
    alternative: alternative.profile,
    explanation: generateExplanation(bestMatch.profile, answers, bestMatch.score),
    confidenceStatement: generateConfidenceStatement(bestMatch.score, bestMatch.profile),
    brewTips: getBrewTips(brewMethod),
    cafeOrderScript: generateCafeOrderScript(bestMatch.profile, answers),
    upgradePathSuggestion: generateUpgradeSuggestion(answers),
  };
}

/**
 * Get a quick recommendation summary for sharing
 */
export function getRecommendationSummary(recommendation: RecommendationOutput): string {
  return `${recommendation.bestMatch.name} - ${recommendation.bestMatch.description.slice(0, 100)}...`;
}
