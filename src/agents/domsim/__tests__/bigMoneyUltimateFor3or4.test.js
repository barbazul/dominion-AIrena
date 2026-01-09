
import BigMoneyUltimateFor3or4 from '../bigMoneyUltimateFor3or4.js';
import cards from '../../../game/cards.js';

describe('BigMoneyUltimateFor3or4', () => {
  let player;
  let mockState;
  let mockMy;

  beforeEach(() => {
    player = new BigMoneyUltimateFor3or4();
    mockState = {
      gainsToEndGame: jest.fn()
    };
    mockMy = {
      countInDeck: jest.fn()
    };
  });

  test('should initialize with correct name', () => {
    expect(player.name).toBe('Big Money Ultimate for 3 or 4');
  });

  describe('gainPriority', () => {
    test('should include Province when player has Gold', () => {
      mockMy.countInDeck.mockReturnValue(1);
      const priority = player.gainPriority(mockState, mockMy);
      expect(priority).toContain(cards.Province);
      expect(mockMy.countInDeck).toHaveBeenCalledWith(cards.Gold);
    });

    test('should not include Province when player has no Gold', () => {
      mockMy.countInDeck.mockReturnValue(0);
      const priority = player.gainPriority(mockState, mockMy);
      expect(priority).not.toContain(cards.Province);
    });

    test('should include Duchy when 7 or fewer gains remain', () => {
      mockState.gainsToEndGame.mockReturnValue(7);
      const priority = player.gainPriority(mockState, mockMy);
      expect(priority).toContain(cards.Duchy);
    });

    test('should not include Duchy when more than 7 gains remain', () => {
      mockState.gainsToEndGame.mockReturnValue(8);
      const priority = player.gainPriority(mockState, mockMy);
      expect(priority).not.toContain(cards.Duchy);
    });

    test('should include Estate when 3 or fewer gains remain', () => {
      mockState.gainsToEndGame.mockReturnValue(3);
      const priority = player.gainPriority(mockState, mockMy);
      expect(priority).toContain(cards.Estate);
    });

    test('should not include Estate when more than 3 gains remain', () => {
      mockState.gainsToEndGame.mockReturnValue(4);
      const priority = player.gainPriority(mockState, mockMy);
      expect(priority).not.toContain(cards.Estate);
    });

    test('should always include Gold and Silver in priority list', () => {
      const priority = player.gainPriority(mockState, mockMy);
      expect(priority).toContain(cards.Gold);
      expect(priority).toContain(cards.Silver);
    });

    test('should maintain correct priority order', () => {
      mockMy.countInDeck.mockReturnValue(1); // Has Gold
      mockState.gainsToEndGame.mockReturnValue(2); // Near end game
      const priority = player.gainPriority(mockState, mockMy);
      
      // Check that the order is maintained
      const expectedOrder = [
        cards.Province,
        cards.Duchy,
        cards.Estate,
        cards.Gold,
        cards.Silver
      ];
      
      expectedOrder.forEach((card, index) => {
        expect(priority[index]).toBe(card);
      });
    });
  });
});