import IronworksGardensScissors from '../ironworksGardensScissors.js';
import cards from '../../../game/cards.js';

describe('IronworksGardensScissors', () => {
  let agent;
  let mockState;
  let mockMy;

  beforeEach(() => {
    agent = new IronworksGardensScissors();
    mockState = {};
    mockMy = {
      countInDeck: jest.fn().mockReturnValue(0)
    };
  });

  describe('constructor', () => {
    it('should require Gardens and Ironworks', () => {
      expect(agent.requires).toEqual([cards.Gardens, cards.Ironworks]);
    });
  });

  describe('gainPriority', () => {
    it('returns base priority at start of game (no Silver, no Ironworks)', () => {
      mockMy.countInDeck.mockReturnValue(0);

      expect(agent.gainPriority(mockState, mockMy)).toStrictEqual([
        cards.Province,
        cards.Gold,
        cards.Ironworks,
        cards.Silver,
        cards.Copper
      ]);
    });

    it('includes Duchy when Silver count > 2', () => {
      mockMy.countInDeck.mockImplementation(card => card === cards.Silver ? 3 : 0);

      expect(agent.gainPriority(mockState, mockMy)).toContain(cards.Duchy);
    });

    it('excludes Duchy when Silver count <= 2', () => {
      mockMy.countInDeck.mockImplementation(card => card === cards.Silver ? 2 : 0);

      expect(agent.gainPriority(mockState, mockMy)).not.toContain(cards.Duchy);
    });

    it('includes Gardens when Silver count > 2', () => {
      mockMy.countInDeck.mockImplementation(card => card === cards.Silver ? 3 : 0);

      expect(agent.gainPriority(mockState, mockMy)).toContain(cards.Gardens);
    });

    it('excludes Gardens when Silver count <= 2', () => {
      mockMy.countInDeck.mockImplementation(card => card === cards.Silver ? 2 : 0);

      expect(agent.gainPriority(mockState, mockMy)).not.toContain(cards.Gardens);
    });

    it('includes Ironworks when count < 2', () => {
      mockMy.countInDeck.mockImplementation(card => card === cards.Ironworks ? 1 : 0);

      expect(agent.gainPriority(mockState, mockMy)).toContain(cards.Ironworks);
    });

    it('excludes Ironworks when count >= 2', () => {
      mockMy.countInDeck.mockImplementation(card => card === cards.Ironworks ? 2 : 0);

      expect(agent.gainPriority(mockState, mockMy)).not.toContain(cards.Ironworks);
    });

    it('includes Estate when Silver count > 5', () => {
      mockMy.countInDeck.mockImplementation(card => card === cards.Silver ? 6 : 0);

      expect(agent.gainPriority(mockState, mockMy)).toContain(cards.Estate);
    });

    it('excludes Estate when Silver count <= 5', () => {
      mockMy.countInDeck.mockImplementation(card => card === cards.Silver ? 5 : 0);

      expect(agent.gainPriority(mockState, mockMy)).not.toContain(cards.Estate);
    });

    it('returns full priority when Silver > 5 and Ironworks < 2', () => {
      mockMy.countInDeck.mockImplementation(card => {
        if (card === cards.Silver) return 6;
        if (card === cards.Ironworks) return 1;
        return 0;
      });

      expect(agent.gainPriority(mockState, mockMy)).toStrictEqual([
        cards.Province,
        cards.Duchy,
        cards.Gardens,
        cards.Gold,
        cards.Ironworks,
        cards.Estate,
        cards.Silver,
        cards.Copper
      ]);
    });

    it('always includes Province, Gold, Silver, and Copper', () => {
      mockMy.countInDeck.mockReturnValue(0);
      const priority = agent.gainPriority(mockState, mockMy);

      expect(priority).toContain(cards.Province);
      expect(priority).toContain(cards.Gold);
      expect(priority).toContain(cards.Silver);
      expect(priority).toContain(cards.Copper);
    });

    it('Province appears before Gold', () => {
      mockMy.countInDeck.mockReturnValue(0);
      const priority = agent.gainPriority(mockState, mockMy);

      expect(priority.indexOf(cards.Province)).toBeLessThan(priority.indexOf(cards.Gold));
    });

    it('Gold appears before Silver', () => {
      mockMy.countInDeck.mockReturnValue(0);
      const priority = agent.gainPriority(mockState, mockMy);

      expect(priority.indexOf(cards.Gold)).toBeLessThan(priority.indexOf(cards.Silver));
    });

    it('Silver appears before Copper', () => {
      mockMy.countInDeck.mockReturnValue(0);
      const priority = agent.gainPriority(mockState, mockMy);

      expect(priority.indexOf(cards.Silver)).toBeLessThan(priority.indexOf(cards.Copper));
    });

    it('Duchy appears before Gardens when both are included', () => {
      mockMy.countInDeck.mockImplementation(card => card === cards.Silver ? 3 : 0);
      const priority = agent.gainPriority(mockState, mockMy);

      expect(priority.indexOf(cards.Duchy)).toBeLessThan(priority.indexOf(cards.Gardens));
    });

    it('Ironworks appears before Estate when both are included', () => {
      mockMy.countInDeck.mockImplementation(card => {
        if (card === cards.Silver) return 6;
        if (card === cards.Ironworks) return 0;
        return 0;
      });
      const priority = agent.gainPriority(mockState, mockMy);

      expect(priority.indexOf(cards.Ironworks)).toBeLessThan(priority.indexOf(cards.Estate));
    });
  });
});
