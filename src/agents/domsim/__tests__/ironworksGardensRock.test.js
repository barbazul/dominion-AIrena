import IronworksGardensRock from '../ironworksGardensRock.js';
import cards from '../../../game/cards.js';

class MockPlayer {
  constructor (deck = {}) {
    this._deck = deck;
  }

  countInDeck (card) {
    return this._deck[card] || 0;
  }
}

describe('IronworksGardensRock', () => {
  let agent;
  let mockState;

  beforeEach(() => {
    agent = new IronworksGardensRock();
    mockState = {};
  });

  describe('constructor', () => {
    it('should require Gardens and Ironworks', () => {
      expect(agent.requires).toEqual([cards.Gardens, cards.Ironworks]);
    });

    it('should have the correct display name', () => {
      expect(agent.name).toBe('Ironworks/Gardens (Rock)');
    });
  });

  describe('gainPriority', () => {
    it('returns base priority at start of game (no Ironworks, no Gardens)', () => {
      const mockMy = new MockPlayer();

      expect(agent.gainPriority(mockState, mockMy)).toStrictEqual([
        cards.Ironworks,
        cards.Silver,
        cards.Copper
      ]);
    });

    it('includes Gardens when Ironworks count > 5', () => {
      const mockMy = new MockPlayer({ [cards.Ironworks]: 6 });

      expect(agent.gainPriority(mockState, mockMy)).toContain(cards.Gardens);
    });

    it('excludes Gardens when Ironworks count <= 5', () => {
      const mockMy = new MockPlayer({ [cards.Ironworks]: 5 });

      expect(agent.gainPriority(mockState, mockMy)).not.toContain(cards.Gardens);
    });

    it('includes Duchy when Ironworks count > 5', () => {
      const mockMy = new MockPlayer({ [cards.Ironworks]: 6 });

      expect(agent.gainPriority(mockState, mockMy)).toContain(cards.Duchy);
    });

    it('excludes Duchy when Ironworks count <= 5', () => {
      const mockMy = new MockPlayer({ [cards.Ironworks]: 5 });

      expect(agent.gainPriority(mockState, mockMy)).not.toContain(cards.Duchy);
    });

    it('always includes Ironworks unconditionally', () => {
      const mockMy = new MockPlayer();

      expect(agent.gainPriority(mockState, mockMy)).toContain(cards.Ironworks);
    });

    it('includes Estate when Gardens count > 0', () => {
      const mockMy = new MockPlayer({ [cards.Gardens]: 1 });

      expect(agent.gainPriority(mockState, mockMy)).toContain(cards.Estate);
    });

    it('excludes Estate when Gardens count is 0', () => {
      const mockMy = new MockPlayer();

      expect(agent.gainPriority(mockState, mockMy)).not.toContain(cards.Estate);
    });

    it('returns full priority when all conditions are met', () => {
      const mockMy = new MockPlayer({ [cards.Ironworks]: 6, [cards.Gardens]: 1 });

      expect(agent.gainPriority(mockState, mockMy)).toStrictEqual([
        cards.Gardens,
        cards.Duchy,
        cards.Ironworks,
        cards.Estate,
        cards.Silver,
        cards.Copper
      ]);
    });

    it('always includes Ironworks, Silver, and Copper', () => {
      const mockMy = new MockPlayer();
      const priority = agent.gainPriority(mockState, mockMy);

      expect(priority).toContain(cards.Ironworks);
      expect(priority).toContain(cards.Silver);
      expect(priority).toContain(cards.Copper);
    });

    it('Gardens appears before Duchy when both are included', () => {
      const mockMy = new MockPlayer({ [cards.Ironworks]: 6 });
      const priority = agent.gainPriority(mockState, mockMy);

      expect(priority.indexOf(cards.Gardens)).toBeLessThan(priority.indexOf(cards.Duchy));
    });

    it('Ironworks appears before Estate when both are included', () => {
      const mockMy = new MockPlayer({ [cards.Gardens]: 1 });
      const priority = agent.gainPriority(mockState, mockMy);

      expect(priority.indexOf(cards.Ironworks)).toBeLessThan(priority.indexOf(cards.Estate));
    });

    it('Silver appears before Copper', () => {
      const mockMy = new MockPlayer();
      const priority = agent.gainPriority(mockState, mockMy);

      expect(priority.indexOf(cards.Silver)).toBeLessThan(priority.indexOf(cards.Copper));
    });

    it('Gardens and Duchy appear before Ironworks when Ironworks > 5', () => {
      const mockMy = new MockPlayer({ [cards.Ironworks]: 6 });
      const priority = agent.gainPriority(mockState, mockMy);

      expect(priority.indexOf(cards.Gardens)).toBeLessThan(priority.indexOf(cards.Ironworks));
      expect(priority.indexOf(cards.Duchy)).toBeLessThan(priority.indexOf(cards.Ironworks));
    });
  });
});
