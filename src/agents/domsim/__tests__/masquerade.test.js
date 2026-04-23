import Masquerade from '../masquerade.js';
import cards from '../../../game/cards.js';

describe('Masquerade', () => {
  let masquerade;
  let mockState;
  let mockPlayer;

  beforeEach(() => {
    masquerade = new Masquerade();
    mockState = {
      countInSupply: jest.fn()
    };
    mockPlayer = {
      countInDeck: jest.fn()
    };
  });

  describe('constructor', () => {
    it('should require the Masquerade card', () => {
      expect(masquerade.requires).toEqual([cards.Masquerade]);
    });
  });

  describe('gainPriority', () => {
    it('default start-of-game priority excludes Province, includes Gold and Silver', () => {
      mockState.countInSupply.mockReturnValue(8);
      mockPlayer.countInDeck.mockImplementation(card => {
        if (card === cards.Gold) return 0;
        if (card === cards.Masquerade) return 1;
        return 0;
      });

      const priority = masquerade.gainPriority(mockState, mockPlayer);

      expect(priority).not.toContain(cards.Province);
      expect(priority).toContain(cards.Gold);
      expect(priority).toContain(cards.Silver);
      expect(priority).not.toContain(cards.Masquerade);
      expect(priority).not.toContain(cards.Duchy);
      expect(priority).not.toContain(cards.Estate);
    });

    it('should push Province when gold count > 1', () => {
      mockState.countInSupply.mockReturnValue(8);
      mockPlayer.countInDeck.mockImplementation(card => {
        if (card === cards.Gold) return 2;
        return 1;
      });

      const priority = masquerade.gainPriority(mockState, mockPlayer);

      expect(priority).toContain(cards.Province);
    });

    it('should not push Province when gold count is exactly 1', () => {
      mockState.countInSupply.mockReturnValue(8);
      mockPlayer.countInDeck.mockImplementation(card => {
        if (card === cards.Gold) return 1;
        return 1;
      });

      const priority = masquerade.gainPriority(mockState, mockPlayer);

      expect(priority).not.toContain(cards.Province);
    });

    it('should push Duchy when Province supply <= 4', () => {
      mockState.countInSupply.mockReturnValue(4);
      mockPlayer.countInDeck.mockReturnValue(1);

      const priority = masquerade.gainPriority(mockState, mockPlayer);

      expect(priority).toContain(cards.Duchy);
    });

    it('should not push Duchy when Province supply is 6', () => {
      mockState.countInSupply.mockReturnValue(6);
      mockPlayer.countInDeck.mockReturnValue(1);

      const priority = masquerade.gainPriority(mockState, mockPlayer);

      expect(priority).not.toContain(cards.Duchy);
    });

    it('should push Duchy (second occurrence) when Province supply is exactly 5', () => {
      mockState.countInSupply.mockReturnValue(5);
      mockPlayer.countInDeck.mockReturnValue(1);

      const priority = masquerade.gainPriority(mockState, mockPlayer);

      expect(priority).toContain(cards.Duchy);
    });

    it('should push Estate when Province supply <= 2', () => {
      mockState.countInSupply.mockReturnValue(2);
      mockPlayer.countInDeck.mockReturnValue(1);

      const priority = masquerade.gainPriority(mockState, mockPlayer);

      expect(priority).toContain(cards.Estate);
    });

    it('should not push Estate when Province supply is 3', () => {
      mockState.countInSupply.mockReturnValue(3);
      mockPlayer.countInDeck.mockReturnValue(1);

      const priority = masquerade.gainPriority(mockState, mockPlayer);

      expect(priority).not.toContain(cards.Estate);
    });

    it('should push Masquerade when none in deck', () => {
      mockState.countInSupply.mockReturnValue(8);
      mockPlayer.countInDeck.mockReturnValue(0);

      const priority = masquerade.gainPriority(mockState, mockPlayer);

      expect(priority).toContain(cards.Masquerade);
    });

    it('should not push Masquerade when already have one in deck', () => {
      mockState.countInSupply.mockReturnValue(8);
      mockPlayer.countInDeck.mockImplementation(card => {
        if (card === cards.Masquerade) return 1;
        return 0;
      });

      const priority = masquerade.gainPriority(mockState, mockPlayer);

      expect(priority).not.toContain(cards.Masquerade);
    });

    it('should have Gold appear before Masquerade in priority order', () => {
      mockState.countInSupply.mockReturnValue(8);
      mockPlayer.countInDeck.mockReturnValue(0);

      const priority = masquerade.gainPriority(mockState, mockPlayer);

      expect(priority.indexOf(cards.Gold)).toBeLessThan(priority.indexOf(cards.Masquerade));
    });

    it('should have Gold appear before Silver in priority order', () => {
      mockState.countInSupply.mockReturnValue(8);
      mockPlayer.countInDeck.mockReturnValue(1);

      const priority = masquerade.gainPriority(mockState, mockPlayer);

      expect(priority.indexOf(cards.Gold)).toBeLessThan(priority.indexOf(cards.Silver));
    });

    it('Province should appear before Gold when conditions met', () => {
      mockState.countInSupply.mockReturnValue(8);
      mockPlayer.countInDeck.mockImplementation(card => {
        if (card === cards.Gold) return 2;
        return 1;
      });

      const priority = masquerade.gainPriority(mockState, mockPlayer);

      expect(priority.indexOf(cards.Province)).toBeLessThan(priority.indexOf(cards.Gold));
    });
  });
});
