import { describe, it, expect } from 'vitest';
import { getBrewTips, suggestBrewMethod, brewTipsData } from './brew-tips';
import type { BrewMethod } from '@/lib/types';

describe('Brew Tips', () => {
  describe('getBrewTips', () => {
    const methods: BrewMethod[] = [
      'drip',
      'french-press',
      'pour-over',
      'aeropress',
      'moka-pot',
      'espresso',
      'cold-brew',
      'pods',
    ];

    methods.forEach((method) => {
      it(`returns tips for ${method}`, () => {
        const tips = getBrewTips(method);

        expect(tips).toBeDefined();
        expect(tips.method).toBe(method);
        expect(tips.ratio).toBeDefined();
        expect(tips.grindSize).toBeDefined();
        expect(tips.tip).toBeDefined();
      });
    });

    it('drip method has correct grind size', () => {
      const tips = getBrewTips('drip');
      expect(tips.grindSize.toLowerCase()).toContain('medium');
    });

    it('french press has coarse grind size', () => {
      const tips = getBrewTips('french-press');
      expect(tips.grindSize.toLowerCase()).toContain('coarse');
    });

    it('espresso has fine grind size', () => {
      const tips = getBrewTips('espresso');
      expect(tips.grindSize.toLowerCase()).toContain('fine');
    });

    it('cold brew has longer brew time', () => {
      const tips = getBrewTips('cold-brew');
      expect(tips.brewTime).toContain('12');
    });
  });

  describe('suggestBrewMethod', () => {
    it('suggests cold brew for iced with no equipment', () => {
      const method = suggestBrewMethod(undefined, 'iced');
      expect(method).toBe('cold-brew');
    });

    it('suggests cold brew for iced with none equipment', () => {
      const method = suggestBrewMethod('none', 'iced');
      expect(method).toBe('cold-brew');
    });

    it('suggests drip for hot with drip equipment', () => {
      const method = suggestBrewMethod('drip', 'hot');
      expect(method).toBe('drip');
    });

    it('suggests french-press for french-press equipment', () => {
      const method = suggestBrewMethod('french-press', 'hot');
      expect(method).toBe('french-press');
    });

    it('suggests espresso for espresso equipment', () => {
      const method = suggestBrewMethod('espresso', 'hot');
      expect(method).toBe('espresso');
    });

    it('suggests pods for pods equipment', () => {
      const method = suggestBrewMethod('pods', 'hot');
      expect(method).toBe('pods');
    });

    it('defaults to drip when no equipment specified', () => {
      const method = suggestBrewMethod(undefined, 'hot');
      expect(method).toBe('drip');
    });
  });

  describe('brewTipsData', () => {
    it('has data for all brew methods', () => {
      const methods: BrewMethod[] = [
        'drip',
        'french-press',
        'pour-over',
        'aeropress',
        'moka-pot',
        'espresso',
        'cold-brew',
        'pods',
      ];

      methods.forEach((method) => {
        expect(brewTipsData[method]).toBeDefined();
      });
    });

    it('all tips have required fields', () => {
      Object.values(brewTipsData).forEach((tips) => {
        expect(tips.method).toBeDefined();
        expect(tips.ratio).toBeDefined();
        expect(tips.grindSize).toBeDefined();
        expect(tips.tip).toBeDefined();
        expect(tips.tip.length).toBeGreaterThan(10);
      });
    });
  });
});
