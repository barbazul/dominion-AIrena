import Minion from '../minion';
import { DomPlayer } from '../domPlayer';
import cards from '../../../game/cards';

describe('Minion Strategy', () => {
  let minion;
  let mockState;
  let mockPlayer;

  beforeEach(() => {
    minion = new Minion();
    mockState = {
      countInSupply: jest.fn().mockReturnValue(8)
    };
    mockPlayer = {
      countInDeck: jest.fn().mockReturnValue(0)
    };
  });

  it('should extend DomPlayer', () => {
    expect(minion).toBeInstanceOf(DomPlayer);
  });

  describe('constructor', () => {
    it('should require the Minion card', () => {
      expect(minion.requires).toEqual([cards.Minion]);
    });
  });

  describe('gainPriority', () => {
    it('should always include Minion and Silver', () => {
      const priority = minion.gainPriority(mockState, mockPlayer);

      expect(priority).toContain(cards.Minion);
      expect(priority).toContain(cards.Silver);
    });

    it('should place Minion before Silver', () => {
      const priority = minion.gainPriority(mockState, mockPlayer);

      expect(priority.indexOf(cards.Minion)).toBeLessThan(priority.indexOf(cards.Silver));
    });

    describe('Province condition', () => {
      it('should include Province when more than 5 Minions are in deck', () => {
        mockPlayer.countInDeck.mockImplementation(card =>
          card === cards.Minion ? 6 : 0
        );

        const priority = minion.gainPriority(mockState, mockPlayer);

        expect(priority).toContain(cards.Province);
      });

      it('should not include Province when exactly 5 Minions are in deck', () => {
        mockPlayer.countInDeck.mockImplementation(card =>
          card === cards.Minion ? 5 : 0
        );

        const priority = minion.gainPriority(mockState, mockPlayer);

        expect(priority).not.toContain(cards.Province);
      });

      it('should not include Province when fewer than 5 Minions are in deck', () => {
        mockPlayer.countInDeck.mockImplementation(card =>
          card === cards.Minion ? 3 : 0
        );

        const priority = minion.gainPriority(mockState, mockPlayer);

        expect(priority).not.toContain(cards.Province);
      });
    });

    describe('Duchy condition', () => {
      it('should include Duchy when Province supply is exactly 4', () => {
        mockState.countInSupply.mockImplementation(card =>
          card === cards.Province ? 4 : 8
        );

        const priority = minion.gainPriority(mockState, mockPlayer);

        expect(priority).toContain(cards.Duchy);
      });

      it('should include Duchy when Province supply is below 4', () => {
        mockState.countInSupply.mockImplementation(card =>
          card === cards.Province ? 2 : 8
        );

        const priority = minion.gainPriority(mockState, mockPlayer);

        expect(priority).toContain(cards.Duchy);
      });

      it('should not include Duchy when Province supply is above 4', () => {
        mockState.countInSupply.mockImplementation(card =>
          card === cards.Province ? 5 : 8
        );

        const priority = minion.gainPriority(mockState, mockPlayer);

        expect(priority).not.toContain(cards.Duchy);
      });
    });

    describe('Estate condition', () => {
      it('should include Estate when Province supply is exactly 2', () => {
        mockState.countInSupply.mockImplementation(card =>
          card === cards.Province ? 2 : 8
        );

        const priority = minion.gainPriority(mockState, mockPlayer);

        expect(priority).toContain(cards.Estate);
      });

      it('should include Estate when Province supply is below 2', () => {
        mockState.countInSupply.mockImplementation(card =>
          card === cards.Province ? 1 : 8
        );

        const priority = minion.gainPriority(mockState, mockPlayer);

        expect(priority).toContain(cards.Estate);
      });

      it('should not include Estate when Province supply is above 2', () => {
        mockState.countInSupply.mockImplementation(card =>
          card === cards.Province ? 3 : 8
        );

        const priority = minion.gainPriority(mockState, mockPlayer);

        expect(priority).not.toContain(cards.Estate);
      });
    });

    it('should return only Minion and Silver at start of game', () => {
      mockState.countInSupply.mockReturnValue(8);
      mockPlayer.countInDeck.mockReturnValue(0);

      const priority = minion.gainPriority(mockState, mockPlayer);

      expect(priority).toStrictEqual([cards.Minion, cards.Silver]);
    });

    it('should return Province, Duchy, Estate, Minion, Silver in late game with many Minions', () => {
      mockPlayer.countInDeck.mockImplementation(card =>
        card === cards.Minion ? 6 : 0
      );
      mockState.countInSupply.mockImplementation(card =>
        card === cards.Province ? 2 : 8
      );

      const priority = minion.gainPriority(mockState, mockPlayer);

      expect(priority.indexOf(cards.Province)).toBeLessThan(priority.indexOf(cards.Duchy));
      expect(priority.indexOf(cards.Duchy)).toBeLessThan(priority.indexOf(cards.Estate));
      expect(priority.indexOf(cards.Estate)).toBeLessThan(priority.indexOf(cards.Minion));
      expect(priority.indexOf(cards.Minion)).toBeLessThan(priority.indexOf(cards.Silver));
    });
  });
});
