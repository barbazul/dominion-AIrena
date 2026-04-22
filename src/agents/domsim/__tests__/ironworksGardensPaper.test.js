import IronworksGardensPaper from '../ironworksGardensPaper.js';
import cards from '../../../game/cards.js';

describe('IronworksGardensPaper', () => {
  let agent;
  let mockState;
  let mockMy;

  beforeEach(() => {
    agent = new IronworksGardensPaper();
    mockState = {};
    mockMy = {
      countInDeck: jest.fn().mockReturnValue(0)
    };
  });

  describe('constructor', () => {
    it('should require Gardens and Ironworks', () => {
      expect(agent.requires).toEqual([cards.Gardens, cards.Ironworks]);
    });

    it('should have the correct display name', () => {
      expect(agent.name).toBe('Ironworks/Gardens (Paper)');
    });
  });

  describe('gainPriority', () => {
    it('returns base priority at start of game (no Ironworks, no Gardens)', () => {
      mockMy.countInDeck.mockReturnValue(0);

      expect(agent.gainPriority(mockState, mockMy)).toStrictEqual([
        cards.Ironworks,
        cards.Silver,
        cards.Copper
      ]);
    });

    it('includes Duchy when Ironworks count > 1', () => {
      mockMy.countInDeck.mockImplementation(card => card === cards.Ironworks ? 2 : 0);

      expect(agent.gainPriority(mockState, mockMy)).toContain(cards.Duchy);
    });

    it('excludes Duchy when Ironworks count <= 1', () => {
      mockMy.countInDeck.mockImplementation(card => card === cards.Ironworks ? 1 : 0);

      expect(agent.gainPriority(mockState, mockMy)).not.toContain(cards.Duchy);
    });

    it('includes Gardens when Ironworks count > 1', () => {
      mockMy.countInDeck.mockImplementation(card => card === cards.Ironworks ? 2 : 0);

      expect(agent.gainPriority(mockState, mockMy)).toContain(cards.Gardens);
    });

    it('excludes Gardens when Ironworks count <= 1', () => {
      mockMy.countInDeck.mockImplementation(card => card === cards.Ironworks ? 1 : 0);

      expect(agent.gainPriority(mockState, mockMy)).not.toContain(cards.Gardens);
    });

    it('always includes Ironworks unconditionally', () => {
      mockMy.countInDeck.mockReturnValue(0);

      expect(agent.gainPriority(mockState, mockMy)).toContain(cards.Ironworks);
    });

    it('includes Estate when Gardens count > 0', () => {
      mockMy.countInDeck.mockImplementation(card => card === cards.Gardens ? 1 : 0);

      expect(agent.gainPriority(mockState, mockMy)).toContain(cards.Estate);
    });

    it('excludes Estate when Gardens count is 0', () => {
      mockMy.countInDeck.mockReturnValue(0);

      expect(agent.gainPriority(mockState, mockMy)).not.toContain(cards.Estate);
    });

    it('returns full priority when all conditions are met', () => {
      mockMy.countInDeck.mockImplementation(card => {
        if (card === cards.Ironworks) return 2;
        if (card === cards.Gardens) return 1;
        return 0;
      });

      expect(agent.gainPriority(mockState, mockMy)).toStrictEqual([
        cards.Duchy,
        cards.Gardens,
        cards.Ironworks,
        cards.Estate,
        cards.Silver,
        cards.Copper
      ]);
    });

    it('always includes Ironworks, Silver, and Copper', () => {
      mockMy.countInDeck.mockReturnValue(0);
      const priority = agent.gainPriority(mockState, mockMy);

      expect(priority).toContain(cards.Ironworks);
      expect(priority).toContain(cards.Silver);
      expect(priority).toContain(cards.Copper);
    });

    it('Duchy appears before Gardens when both are included', () => {
      mockMy.countInDeck.mockImplementation(card => card === cards.Ironworks ? 2 : 0);
      const priority = agent.gainPriority(mockState, mockMy);

      expect(priority.indexOf(cards.Duchy)).toBeLessThan(priority.indexOf(cards.Gardens));
    });

    it('Ironworks appears before Estate when both are included', () => {
      mockMy.countInDeck.mockImplementation(card => card === cards.Gardens ? 1 : 0);
      const priority = agent.gainPriority(mockState, mockMy);

      expect(priority.indexOf(cards.Ironworks)).toBeLessThan(priority.indexOf(cards.Estate));
    });

    it('Silver appears before Copper', () => {
      mockMy.countInDeck.mockReturnValue(0);
      const priority = agent.gainPriority(mockState, mockMy);

      expect(priority.indexOf(cards.Silver)).toBeLessThan(priority.indexOf(cards.Copper));
    });

    it('Duchy and Gardens appear before Ironworks when Ironworks > 1', () => {
      mockMy.countInDeck.mockImplementation(card => card === cards.Ironworks ? 2 : 0);
      const priority = agent.gainPriority(mockState, mockMy);

      expect(priority.indexOf(cards.Duchy)).toBeLessThan(priority.indexOf(cards.Ironworks));
      expect(priority.indexOf(cards.Gardens)).toBeLessThan(priority.indexOf(cards.Ironworks));
    });
  });
});
