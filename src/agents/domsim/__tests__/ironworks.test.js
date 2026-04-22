import Ironworks from '../ironworks.js';
import cards from '../../../game/cards.js';

class MockState {
  constructor (supply = {}) {
    this._supply = supply;
  }

  countInSupply (card) {
    return this._supply[card] ?? 8;
  }
}

class MockPlayer {
  constructor (deck = {}) {
    this._deck = deck;
  }

  countInDeck (card) {
    return this._deck[card] || 0;
  }
}

describe('Ironworks', () => {
  let agent;

  beforeEach(() => {
    agent = new Ironworks();
  });

  describe('constructor', () => {
    it('should have the correct display name', () => {
      expect(agent.name).toBe('Ironworks');
    });

    it('should require Ironworks', () => {
      expect(agent.requires).toEqual([cards.Ironworks]);
    });
  });

  describe('gainPriority', () => {
    it('returns base priority at start of game (no Gold in deck, full Province supply)', () => {
      const mockState = new MockState();
      const mockMy = new MockPlayer();

      expect(agent.gainPriority(mockState, mockMy)).toStrictEqual([
        cards.Gold,
        cards.Ironworks,
        cards.Silver
      ]);
    });

    it('includes Province when Gold count > 0', () => {
      const mockState = new MockState();
      const mockMy = new MockPlayer({ [cards.Gold]: 1 });

      expect(agent.gainPriority(mockState, mockMy)).toContain(cards.Province);
    });

    it('excludes Province when Gold count is 0', () => {
      const mockState = new MockState();
      const mockMy = new MockPlayer();

      expect(agent.gainPriority(mockState, mockMy)).not.toContain(cards.Province);
    });

    it('Province appears before Gold when Gold > 0', () => {
      const mockState = new MockState();
      const mockMy = new MockPlayer({ [cards.Gold]: 1 });
      const priority = agent.gainPriority(mockState, mockMy);

      expect(priority.indexOf(cards.Province)).toBeLessThan(priority.indexOf(cards.Gold));
    });

    it('includes first Duchy when Province supply <= 4', () => {
      const mockState = new MockState({ [cards.Province]: 4 });
      const mockMy = new MockPlayer();
      const priority = agent.gainPriority(mockState, mockMy);

      expect(priority.indexOf(cards.Duchy)).toBeLessThan(priority.indexOf(cards.Gold));
    });

    it('excludes first Duchy (before Gold) when Province supply > 4', () => {
      const mockState = new MockState({ [cards.Province]: 5 });
      const mockMy = new MockPlayer();
      const priority = agent.gainPriority(mockState, mockMy);

      expect(priority.indexOf(cards.Duchy)).toBeGreaterThan(priority.indexOf(cards.Gold));
    });

    it('includes Estate when Province supply <= 2', () => {
      const mockState = new MockState({ [cards.Province]: 2 });
      const mockMy = new MockPlayer();

      expect(agent.gainPriority(mockState, mockMy)).toContain(cards.Estate);
    });

    it('excludes Estate when Province supply > 2', () => {
      const mockState = new MockState({ [cards.Province]: 3 });
      const mockMy = new MockPlayer();

      expect(agent.gainPriority(mockState, mockMy)).not.toContain(cards.Estate);
    });

    it('always includes Gold unconditionally', () => {
      const mockState = new MockState();
      const mockMy = new MockPlayer();

      expect(agent.gainPriority(mockState, mockMy)).toContain(cards.Gold);
    });

    it('includes second Duchy (after Gold) when Province supply <= 6', () => {
      const mockState = new MockState({ [cards.Province]: 6 });
      const mockMy = new MockPlayer();
      const priority = agent.gainPriority(mockState, mockMy);

      expect(priority.indexOf(cards.Duchy)).toBeGreaterThan(priority.indexOf(cards.Gold));
    });

    it('excludes Duchy entirely when Province supply > 6', () => {
      const mockState = new MockState({ [cards.Province]: 7 });
      const mockMy = new MockPlayer();

      expect(agent.gainPriority(mockState, mockMy)).not.toContain(cards.Duchy);
    });

    it('includes Ironworks when none in deck', () => {
      const mockState = new MockState();
      const mockMy = new MockPlayer();

      expect(agent.gainPriority(mockState, mockMy)).toContain(cards.Ironworks);
    });

    it('excludes Ironworks when already in deck', () => {
      const mockState = new MockState();
      const mockMy = new MockPlayer({ [cards.Ironworks]: 1 });

      expect(agent.gainPriority(mockState, mockMy)).not.toContain(cards.Ironworks);
    });

    it('always includes Silver unconditionally', () => {
      const mockState = new MockState();
      const mockMy = new MockPlayer();

      expect(agent.gainPriority(mockState, mockMy)).toContain(cards.Silver);
    });

    it('Silver is last in priority', () => {
      const mockState = new MockState();
      const mockMy = new MockPlayer();
      const priority = agent.gainPriority(mockState, mockMy);

      expect(priority[priority.length - 1]).toBe(cards.Silver);
    });

    it('returns full priority when all conditions are met and no Ironworks in deck', () => {
      const mockState = new MockState({ [cards.Province]: 2 });
      const mockMy = new MockPlayer({ [cards.Gold]: 2 });

      expect(agent.gainPriority(mockState, mockMy)).toStrictEqual([
        cards.Province,
        cards.Duchy,
        cards.Estate,
        cards.Gold,
        cards.Duchy,
        cards.Ironworks,
        cards.Silver
      ]);
    });

    it('returns full priority when all conditions are met and Ironworks already in deck', () => {
      const mockState = new MockState({ [cards.Province]: 2 });
      const mockMy = new MockPlayer({ [cards.Gold]: 2, [cards.Ironworks]: 1 });

      expect(agent.gainPriority(mockState, mockMy)).toStrictEqual([
        cards.Province,
        cards.Duchy,
        cards.Estate,
        cards.Gold,
        cards.Duchy,
        cards.Silver
      ]);
    });

    it('Estate appears before Gold when Province supply <= 2', () => {
      const mockState = new MockState({ [cards.Province]: 2 });
      const mockMy = new MockPlayer();
      const priority = agent.gainPriority(mockState, mockMy);

      expect(priority.indexOf(cards.Estate)).toBeLessThan(priority.indexOf(cards.Gold));
    });

    it('second Duchy appears after Gold when Province supply <= 6 but > 4', () => {
      const mockState = new MockState({ [cards.Province]: 5 });
      const mockMy = new MockPlayer();
      const priority = agent.gainPriority(mockState, mockMy);
      const goldIdx = priority.indexOf(cards.Gold);
      const duchyIdx = priority.indexOf(cards.Duchy);

      expect(duchyIdx).toBeGreaterThan(goldIdx);
    });
  });
});
