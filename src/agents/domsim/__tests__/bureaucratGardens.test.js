// bureaucratGardens.test.js
import BureaucratGardens from '../bureaucratGardens';
import cards from '../../../game/cards';

describe('BureaucratGardens', () => {
  let bureaucratGardens;
  let mockState;
  let mockPlayer;

  beforeEach(() => {
    bureaucratGardens = new BureaucratGardens();
    mockState = {
      countInSupply: jest.fn(),
    };
    mockPlayer = {
      countInDeck: jest.fn(),
    };
  });

  describe('gainPriority', () => {
    it('should include "Gardens" in priority if player has more than 4 "Bureaucrat" cards in deck', () => {
      mockPlayer.countInDeck.mockReturnValueOnce(5);

      const result = bureaucratGardens.gainPriority(mockState, mockPlayer);

      expect(result).toContain(cards.Gardens);
    });

    it('should include "Province", "Duchy", and "Estate" in priority if "Gardens" is not available in supply', () => {
      mockState.countInSupply.mockReturnValueOnce(0);

      const result = bureaucratGardens.gainPriority(mockState, mockPlayer);

      expect(result).toContain(cards.Province);
      expect(result).toContain(cards.Duchy);
      expect(result).toContain(cards.Estate);
    });

    it('should always include "Bureaucrat", "Silver", and "Copper" in priority', () => {
      mockState.countInSupply.mockReturnValueOnce(1); // Gardens available
      mockPlayer.countInDeck.mockReturnValueOnce(2);

      const result = bureaucratGardens.gainPriority(mockState, mockPlayer);

      expect(result).toContain(cards.Bureaucrat);
      expect(result).toContain(cards.Silver);
      expect(result).toContain(cards.Copper);
    });

    it('should return the correct priority order based on conditions', () => {
      mockPlayer.countInDeck.mockReturnValueOnce(5);
      mockState.countInSupply.mockReturnValueOnce(0);

      const result = bureaucratGardens.gainPriority(mockState, mockPlayer);

      expect(result).toEqual([
        cards.Gardens,
        cards.Province,
        cards.Duchy,
        cards.Estate,
        cards.Bureaucrat,
        cards.Silver,
        cards.Copper,
      ]);
    });

    it('should not include "Gardens" if player has 4 or fewer "Bureaucrat" cards in deck', () => {
      mockPlayer.countInDeck.mockReturnValueOnce(4);

      const result = bureaucratGardens.gainPriority(mockState, mockPlayer);

      expect(result).not.toContain(cards.Gardens);
    });
  });
});