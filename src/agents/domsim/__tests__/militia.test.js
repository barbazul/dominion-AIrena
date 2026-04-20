import Militia from '../militia.js';
import cards from '../../../game/cards.js';
import { DomPlayer } from '../domPlayer.js';

describe('Militia', () => {
  let militia;
  let mockState;
  let mockPlayer;

  beforeEach(() => {
    militia = new Militia();
    mockState = {
      countInSupply: jest.fn()
    };
    mockPlayer = {
      countInDeck: jest.fn()
    };
  });

  test('should extend DomPlayer', () => {
    expect(militia).toBeInstanceOf(DomPlayer);
  });

  test('should require Militia card', () => {
    expect(militia.requires).toEqual([cards.Militia]);
  });

  describe('gainPriority', () => {
    test('should include Province when player has Gold', () => {
      mockPlayer.countInDeck.mockImplementation((card) =>
        card === cards.Gold ? 1 : 0
      );

      const priority = militia.gainPriority(mockState, mockPlayer);

      expect(priority).toContain(cards.Province);
    });

    test('should not include Province when player has no Gold', () => {
      mockPlayer.countInDeck.mockReturnValue(0);

      const priority = militia.gainPriority(mockState, mockPlayer);

      expect(priority).not.toContain(cards.Province);
    });

    test('should include Duchy when Province pile has 6 or fewer cards', () => {
      mockState.countInSupply.mockImplementation((card) =>
        card === cards.Province ? 6 : 0
      );

      const priority = militia.gainPriority(mockState, mockPlayer);

      expect(priority).toContain(cards.Duchy);
    });

    test('should include Estate when Province pile has 2 or fewer cards', () => {
      mockState.countInSupply.mockImplementation((card) =>
        card === cards.Province ? 2 : 0
      );

      const priority = militia.gainPriority(mockState, mockPlayer);

      expect(priority).toContain(cards.Estate);
    });

    test('should include Militia when player has less than 3 Militia cards', () => {
      mockPlayer.countInDeck.mockImplementation((card) =>
        card === cards.Militia ? 2 : 0
      );

      const priority = militia.gainPriority(mockState, mockPlayer);

      expect(priority).toContain(cards.Militia);
    });

    test('should not include Militia when player has 3 or more Militia cards', () => {
      mockPlayer.countInDeck.mockImplementation((card) =>
        card === cards.Militia ? 3 : 0
      );

      const priority = militia.gainPriority(mockState, mockPlayer);

      const militiaIndex = priority.indexOf(cards.Militia);
      expect(militiaIndex).toBe(-1);
    });

    test('should always include Gold and Silver in priority', () => {
      mockPlayer.countInDeck.mockReturnValue(0);
      mockState.countInSupply.mockReturnValue(8);

      const priority = militia.gainPriority(mockState, mockPlayer);

      expect(priority).toContain(cards.Gold);
      expect(priority).toContain(cards.Silver);
    });

    test('should maintain correct priority order', () => {
      mockPlayer.countInDeck.mockImplementation((card) => {
        if (card === cards.Gold) return 1;
        if (card === cards.Militia) return 2;
        return 0;
      });
      mockState.countInSupply.mockImplementation((card) =>
        card === cards.Province ? 6 : 8
      );

      const priority = militia.gainPriority(mockState, mockPlayer);

      expect(priority).toEqual([
        cards.Province,
        cards.Duchy,
        cards.Gold,
        cards.Militia,
        cards.Silver
      ]);
    });
  });
});
