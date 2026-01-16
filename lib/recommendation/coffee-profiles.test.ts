import { describe, it, expect } from 'vitest';
import {
  coffeeProfiles,
  getCoffeeProfile,
  getProfilesByFlavorProfile,
  getLowAcidityProfiles,
} from './coffee-profiles';

describe('Coffee Profiles', () => {
  describe('coffeeProfiles', () => {
    it('contains at least 10 profiles', () => {
      expect(coffeeProfiles.length).toBeGreaterThanOrEqual(10);
    });

    it('all profiles have required fields', () => {
      coffeeProfiles.forEach((profile) => {
        expect(profile.id).toBeDefined();
        expect(profile.name).toBeDefined();
        expect(profile.description).toBeDefined();
        expect(profile.flavorProfile).toBeDefined();
        expect(profile.roastLevel).toBeDefined();
        expect(profile.originStyle).toBeDefined();
        expect(profile.suggestedBrewMethods).toBeDefined();
        expect(profile.suggestedBrewMethods.length).toBeGreaterThan(0);
        expect(profile.tags).toBeDefined();
        expect(profile.acidityLevel).toBeDefined();
        expect(profile.bodyLevel).toBeDefined();
      });
    });

    it('all profiles have unique IDs', () => {
      const ids = coffeeProfiles.map((p) => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('has at least one profile for each flavor type', () => {
      const flavorProfiles = new Set(coffeeProfiles.map((p) => p.flavorProfile));
      expect(flavorProfiles.size).toBeGreaterThanOrEqual(4);
    });

    it('has at least one profile for each roast level', () => {
      const roastLevels = new Set(coffeeProfiles.map((p) => p.roastLevel));
      expect(roastLevels.has('light')).toBe(true);
      expect(roastLevels.has('medium')).toBe(true);
      expect(roastLevels.has('dark')).toBe(true);
    });

    it('has pod-compatible profiles', () => {
      const podProfiles = coffeeProfiles.filter((p) =>
        p.suggestedBrewMethods.includes('pods')
      );
      expect(podProfiles.length).toBeGreaterThan(0);
    });

    it('has cold-brew compatible profiles', () => {
      const coldBrewProfiles = coffeeProfiles.filter((p) =>
        p.suggestedBrewMethods.includes('cold-brew')
      );
      expect(coldBrewProfiles.length).toBeGreaterThan(0);
    });
  });

  describe('getCoffeeProfile', () => {
    it('returns profile by ID', () => {
      const profile = getCoffeeProfile('brazilian-medium');
      expect(profile).toBeDefined();
      expect(profile?.name).toBe('Brazilian Medium Roast');
    });

    it('returns undefined for non-existent ID', () => {
      const profile = getCoffeeProfile('non-existent');
      expect(profile).toBeUndefined();
    });
  });

  describe('getProfilesByFlavorProfile', () => {
    it('returns profiles matching flavor profile', () => {
      const profiles = getProfilesByFlavorProfile('fruity-bright');
      expect(profiles.length).toBeGreaterThan(0);
      profiles.forEach((p) => {
        expect(p.flavorProfile).toBe('fruity-bright');
      });
    });

    it('returns empty array for non-existent flavor', () => {
      const profiles = getProfilesByFlavorProfile('non-existent' as never);
      expect(profiles.length).toBe(0);
    });
  });

  describe('getLowAcidityProfiles', () => {
    it('returns only low acidity profiles', () => {
      const profiles = getLowAcidityProfiles();
      expect(profiles.length).toBeGreaterThan(0);
      profiles.forEach((p) => {
        expect(p.acidityLevel).toBe('low');
      });
    });

    it('includes Sumatran coffee', () => {
      const profiles = getLowAcidityProfiles();
      const sumatra = profiles.find((p) => p.id === 'sumatra-dark');
      expect(sumatra).toBeDefined();
    });
  });
});
