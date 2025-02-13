import { getCardImageFilename, generateRandomCard } from '../cardUtils';

describe('cardUtils', () => {
  describe('getCardImageFilename', () => {
    it('returns correct filename for destination cards', () => {
      const result = getCardImageFilename([[0, 1]], 'dest_1');
      expect(result).toBe('destination_1.png');
    });

    it('returns correct filename for regular cards', () => {
      const result = getCardImageFilename([[0, 1, 2]]);
      expect(result).toBe('card_012.png');
    });

    it('sorts path directions in filename', () => {
      const result = getCardImageFilename([[2, 0, 1]]);
      expect(result).toBe('card_012.png');
    });

    it('handles multiple paths', () => {
      const result = getCardImageFilename([[2, 1], [0, 3]]);
      expect(result).toBe('card_12_03.png');
    });
  });

  describe('generateRandomCard', () => {
    it('generates a card with valid properties', () => {
      const card = generateRandomCard();
      expect(card).toHaveProperty('id');
      expect(card).toHaveProperty('paths');
      expect(Array.isArray(card.paths)).toBe(true);
      expect(card.paths.length).toBe(1);
      expect(Array.isArray(card.paths[0])).toBe(true);
    });

    it('generates a card with 2-3 directions', () => {
      const card = generateRandomCard();
      expect(card.paths[0].length).toBeGreaterThanOrEqual(2);
      expect(card.paths[0].length).toBeLessThanOrEqual(3);
    });

    it('generates unique directions within a path', () => {
      const card = generateRandomCard();
      const uniqueDirections = new Set(card.paths[0]);
      expect(uniqueDirections.size).toBe(card.paths[0].length);
    });

    it('generates different cards on subsequent calls', () => {
      const card1 = generateRandomCard();
      const card2 = generateRandomCard();
      expect(card1.id).not.toBe(card2.id);
    });
  });
});
