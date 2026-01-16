import { describe, it, expect } from 'vitest';
import { generateRecommendation } from './engine';
import type { QuizAnswers } from '@/lib/types';

describe('Recommendation Engine', () => {
  describe('generateRecommendation', () => {
    it('returns a best match and alternative recommendation', () => {
      const answers: QuizAnswers = {
        milkPreference: 'black',
        temperature: 'hot',
        flavorPreference: 'chocolatey',
        coffeeContext: 'home',
      };

      const result = generateRecommendation(answers);

      expect(result.bestMatch).toBeDefined();
      expect(result.alternative).toBeDefined();
      expect(result.bestMatch.id).not.toEqual(result.alternative.id);
    });

    it('recommends chocolatey profiles for chocolatey preference', () => {
      const answers: QuizAnswers = {
        milkPreference: 'black',
        temperature: 'hot',
        flavorPreference: 'chocolatey',
        coffeeContext: 'home',
      };

      const result = generateRecommendation(answers);

      expect(['chocolatey-nutty', 'sweet-dessert', 'bold-smoky']).toContain(
        result.bestMatch.flavorProfile
      );
    });

    it('recommends fruity profiles for fruity preference', () => {
      const answers: QuizAnswers = {
        milkPreference: 'black',
        temperature: 'hot',
        flavorPreference: 'fruity',
        coffeeContext: 'cafe',
      };

      const result = generateRecommendation(answers);

      expect(['fruity-bright', 'balanced-mild']).toContain(result.bestMatch.flavorProfile);
    });

    it('recommends low acidity coffee when specified', () => {
      const answers: QuizAnswers = {
        milkPreference: 'with-milk',
        temperature: 'hot',
        flavorPreference: 'chocolatey',
        coffeeContext: 'home',
        acidityTolerance: 'low-acidity',
      };

      const result = generateRecommendation(answers);

      expect(result.bestMatch.acidityLevel).toBe('low');
    });

    it('recommends pod-compatible coffee for pod users', () => {
      const answers: QuizAnswers = {
        milkPreference: 'with-milk',
        temperature: 'hot',
        flavorPreference: 'balanced',
        coffeeContext: 'home',
        equipment: 'pods',
      };

      const result = generateRecommendation(answers);

      expect(result.bestMatch.suggestedBrewMethods).toContain('pods');
    });

    it('includes cold brew for iced preference', () => {
      const answers: QuizAnswers = {
        milkPreference: 'black',
        temperature: 'iced',
        flavorPreference: 'chocolatey',
        coffeeContext: 'home',
        equipment: 'none',
      };

      const result = generateRecommendation(answers);

      expect(result.brewTips.method).toBe('cold-brew');
    });

    it('provides appropriate brew tips for French press users', () => {
      const answers: QuizAnswers = {
        milkPreference: 'black',
        temperature: 'hot',
        flavorPreference: 'chocolatey',
        coffeeContext: 'home',
        equipment: 'french-press',
      };

      const result = generateRecommendation(answers);

      expect(result.brewTips.method).toBe('french-press');
      expect(result.brewTips.grindSize.toLowerCase()).toContain('coarse');
    });

    it('generates a cafe order script', () => {
      const answers: QuizAnswers = {
        milkPreference: 'with-milk',
        temperature: 'iced',
        flavorPreference: 'balanced',
        coffeeContext: 'cafe',
      };

      const result = generateRecommendation(answers);

      expect(result.cafeOrderScript).toBeDefined();
      expect(result.cafeOrderScript.toLowerCase()).toContain('iced');
      expect(result.cafeOrderScript).toContain('?');
    });

    it('generates upgrade suggestion for pod users', () => {
      const answers: QuizAnswers = {
        milkPreference: 'black',
        temperature: 'hot',
        flavorPreference: 'balanced',
        coffeeContext: 'home',
        equipment: 'pods',
      };

      const result = generateRecommendation(answers);

      expect(result.upgradePathSuggestion).toBeDefined();
      expect(result.upgradePathSuggestion?.toLowerCase()).toContain('pour-over');
    });

    it('generates explanation for the recommendation', () => {
      const answers: QuizAnswers = {
        milkPreference: 'black',
        temperature: 'hot',
        flavorPreference: 'chocolatey',
        coffeeContext: 'home',
      };

      const result = generateRecommendation(answers);

      expect(result.explanation).toBeDefined();
      expect(result.explanation.length).toBeGreaterThan(20);
    });

    it('generates confidence statement', () => {
      const answers: QuizAnswers = {
        milkPreference: 'black',
        temperature: 'hot',
        flavorPreference: 'chocolatey',
        coffeeContext: 'home',
      };

      const result = generateRecommendation(answers);

      expect(result.confidenceStatement).toBeDefined();
      expect(result.confidenceStatement).toContain('match');
    });

    it('prefers full-bodied coffee for milk drinkers', () => {
      const answers: QuizAnswers = {
        milkPreference: 'sweetened',
        temperature: 'hot',
        flavorPreference: 'chocolatey',
        coffeeContext: 'cafe',
      };

      const result = generateRecommendation(answers);

      // Full-bodied coffees work better with milk
      expect(['medium', 'full']).toContain(result.bestMatch.bodyLevel);
    });

    it('handles espresso equipment', () => {
      const answers: QuizAnswers = {
        milkPreference: 'with-milk',
        temperature: 'hot',
        flavorPreference: 'chocolatey',
        coffeeContext: 'home',
        equipment: 'espresso',
      };

      const result = generateRecommendation(answers);

      expect(result.brewTips.method).toBe('espresso');
    });

    it('recommends different alternatives for variety', () => {
      const answers: QuizAnswers = {
        milkPreference: 'black',
        temperature: 'hot',
        flavorPreference: 'chocolatey',
        coffeeContext: 'home',
      };

      const result = generateRecommendation(answers);

      // Alternative should ideally be different flavor profile or roast
      expect(
        result.bestMatch.flavorProfile !== result.alternative.flavorProfile ||
          result.bestMatch.roastLevel !== result.alternative.roastLevel
      ).toBe(true);
    });
  });
});
