import Mill from '../mill.js';
import cards from '../../../game/cards.js';

describe('Mill', () => {
  let instance;
  let mockState;
  let mockMy;

  beforeEach(() => {
    instance = new Mill();
    mockState = {
      countInSupply: jest.fn()
    };
    mockMy = {
      countInDeck: jest.fn().mockReturnValue(0)
    };
  });

  describe('constructor', () => {
    it('should require Mill', () => {
      expect(instance.requires).toEqual([cards.Mill]);
    });

    it('should be named Mill', () => {
      expect(instance.toString()).toBe('Mill');
    });
  });

  describe('gainPriority', () => {
    it('returns baseline priority at start of game', () => {
      mockState.countInSupply.mockReturnValue(8);
      mockMy.countInDeck.mockReturnValue(0);

      const priority = instance.gainPriority(mockState, mockMy);

      expect(priority).toStrictEqual([
        cards.Gold,
        cards.Silver
      ]);
    });

    it('pushes Province when player has at least one Gold', () => {
      mockState.countInSupply.mockReturnValue(8);
      mockMy.countInDeck.mockImplementation(card => card === cards.Gold ? 1 : 0);

      const priority = instance.gainPriority(mockState, mockMy);

      expect(priority).toContain(cards.Province);
    });

    it('does not push Province when player has no Gold', () => {
      mockState.countInSupply.mockReturnValue(8);
      mockMy.countInDeck.mockReturnValue(0);

      const priority = instance.gainPriority(mockState, mockMy);

      expect(priority).not.toContain(cards.Province);
    });

    it('pushes Duchy and Mill when Province supply is 4', () => {
      mockState.countInSupply.mockReturnValue(4);
      mockMy.countInDeck.mockReturnValue(0);

      const priority = instance.gainPriority(mockState, mockMy);

      expect(priority).toContain(cards.Duchy);
      expect(priority).toContain(cards.Mill);
    });

    it('does not push Duchy or Mill (endgame blocks) when Province supply is 5', () => {
      mockState.countInSupply.mockImplementation(card => {
        if (card === cards.Province) return 5;
        return 8;
      });
      mockMy.countInDeck.mockReturnValue(0);

      const priority = instance.gainPriority(mockState, mockMy);

      expect(priority).not.toContain(cards.Mill);
      expect(priority.indexOf(cards.Duchy)).toBe(priority.lastIndexOf(cards.Duchy));
    });

    it('pushes Estate when Province supply is 2 or less', () => {
      mockState.countInSupply.mockReturnValue(2);
      mockMy.countInDeck.mockReturnValue(0);

      const priority = instance.gainPriority(mockState, mockMy);

      expect(priority).toContain(cards.Estate);
    });

    it('does not push Estate when Province supply is 3', () => {
      mockState.countInSupply.mockReturnValue(3);
      mockMy.countInDeck.mockReturnValue(0);

      const priority = instance.gainPriority(mockState, mockMy);

      expect(priority).not.toContain(cards.Estate);
    });

    it('pushes Duchy unconditionally when Province supply is 6', () => {
      mockState.countInSupply.mockReturnValue(6);
      mockMy.countInDeck.mockReturnValue(0);

      const priority = instance.gainPriority(mockState, mockMy);

      expect(priority).toContain(cards.Duchy);
    });

    it('does not push Duchy unconditionally when Province supply is 7', () => {
      mockState.countInSupply.mockReturnValue(7);
      mockMy.countInDeck.mockReturnValue(0);

      const priority = instance.gainPriority(mockState, mockMy);

      expect(priority).not.toContain(cards.Duchy);
    });

    it('pushes Mill when Silver count is 7 or more', () => {
      mockState.countInSupply.mockReturnValue(8);
      mockMy.countInDeck.mockImplementation(card => card === cards.Silver ? 7 : 0);

      const priority = instance.gainPriority(mockState, mockMy);

      expect(priority).toContain(cards.Mill);
    });

    it('does not push Mill (Silver condition) when Silver count is below 7', () => {
      mockState.countInSupply.mockReturnValue(8);
      mockMy.countInDeck.mockImplementation(card => card === cards.Silver ? 6 : 0);

      const priority = instance.gainPriority(mockState, mockMy);

      expect(priority).not.toContain(cards.Mill);
    });

    it('Province appears before Gold in priority order', () => {
      mockState.countInSupply.mockReturnValue(8);
      mockMy.countInDeck.mockImplementation(card => card === cards.Gold ? 1 : 0);

      const priority = instance.gainPriority(mockState, mockMy);

      expect(priority.indexOf(cards.Province)).toBeLessThan(priority.indexOf(cards.Gold));
    });

    it('Gold appears before Silver in priority order', () => {
      mockState.countInSupply.mockReturnValue(8);
      mockMy.countInDeck.mockReturnValue(0);

      const priority = instance.gainPriority(mockState, mockMy);

      expect(priority.indexOf(cards.Gold)).toBeLessThan(priority.indexOf(cards.Silver));
    });
  });
});
