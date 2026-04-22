import Courtyard from '../courtyard.js';
import cards from '../../../game/cards.js';

describe('Courtyard', () => {
  let agent;
  let mockState;
  let mockMy;

  beforeEach(() => {
    agent = new Courtyard();
    mockState = {
      countInSupply: jest.fn().mockReturnValue(8)
    };
    mockMy = {
      countInDeck: jest.fn().mockReturnValue(0)
    };
    agent.countCardTypeInDeck = jest.fn().mockReturnValue(0);
  });

  describe('constructor', () => {
    it('should require the Courtyard card', () => {
      expect(agent.requires).toEqual([cards.Courtyard]);
    });
  });

  describe('gainPriority', () => {
    describe('Province', () => {
      it('should include Province when player has at least one Gold in deck', () => {
        mockMy.countInDeck.mockImplementation(card => card === cards.Gold ? 1 : 0);

        const priority = agent.gainPriority(mockState, mockMy);

        expect(priority).toContain(cards.Province);
      });

      it('should not include Province when player has no Gold in deck', () => {
        mockMy.countInDeck.mockReturnValue(0);

        const priority = agent.gainPriority(mockState, mockMy);

        expect(priority).not.toContain(cards.Province);
      });
    });

    describe('Duchy (end-game conditions)', () => {
      it('should include Duchy when Province supply is exactly 4', () => {
        mockState.countInSupply.mockImplementation(card => card === cards.Province ? 4 : 8);

        const priority = agent.gainPriority(mockState, mockMy);

        expect(priority).toContain(cards.Duchy);
      });

      it('should include Duchy when Province supply is 5 or less', () => {
        mockState.countInSupply.mockImplementation(card => card === cards.Province ? 5 : 8);

        const priority = agent.gainPriority(mockState, mockMy);

        expect(priority).toContain(cards.Duchy);
      });

      it('should not include Duchy due to <= 4 condition when Province supply is 6 or more', () => {
        mockState.countInSupply.mockReturnValue(8);

        const priority = agent.gainPriority(mockState, mockMy);

        expect(priority).not.toContain(cards.Duchy);
      });
    });

    describe('Estate', () => {
      it('should include Estate when Province supply is 2 or less', () => {
        mockState.countInSupply.mockImplementation(card => card === cards.Province ? 2 : 8);

        const priority = agent.gainPriority(mockState, mockMy);

        expect(priority).toContain(cards.Estate);
      });

      it('should not include Estate when Province supply is above 2', () => {
        mockState.countInSupply.mockImplementation(card => card === cards.Province ? 3 : 8);

        const priority = agent.gainPriority(mockState, mockMy);

        expect(priority).not.toContain(cards.Estate);
      });
    });

    describe('Gold', () => {
      it('should always include Gold unconditionally', () => {
        const priority = agent.gainPriority(mockState, mockMy);

        expect(priority).toContain(cards.Gold);
      });
    });

    describe('Silver (first conditional)', () => {
      it('should include Silver (early) when player has no Silver in deck', () => {
        mockMy.countInDeck.mockImplementation(card => card === cards.Silver ? 0 : 0);

        const priority = agent.gainPriority(mockState, mockMy);

        expect(priority).toContain(cards.Silver);
      });

      it('should not include early Silver when player already has Silver in deck', () => {
        mockMy.countInDeck.mockImplementation(card => card === cards.Silver ? 1 : 0);
        agent.countCardTypeInDeck.mockReturnValue(0);

        const priority = agent.gainPriority(mockState, mockMy);

        // Silver is always added unconditionally later, so check that the early Silver is skipped
        // by verifying Silver appears only once (from the unconditional buy)
        const silverCount = priority.filter(c => c === cards.Silver).length;
        expect(silverCount).toBe(1);
      });
    });

    describe('Courtyard (first: fewer than 1)', () => {
      it('should include Courtyard when player has 0 in deck', () => {
        mockMy.countInDeck.mockImplementation(card => card === cards.Courtyard ? 0 : 0);

        const priority = agent.gainPriority(mockState, mockMy);

        expect(priority).toContain(cards.Courtyard);
      });

      it('should not include Courtyard via < 1 condition when player has 1 or more', () => {
        mockMy.countInDeck.mockImplementation(card => card === cards.Courtyard ? 1 : 0);
        agent.countCardTypeInDeck.mockReturnValue(0);

        const priority = agent.gainPriority(mockState, mockMy);

        // With 1 Courtyard and 0 treasures, only the < 2 condition could fire
        // Verify the first condition does not add Courtyard
        const courtyardCount = priority.filter(c => c === cards.Courtyard).length;
        // < 2 condition fires (1 < 2), so exactly 1 Courtyard expected
        expect(courtyardCount).toBe(1);
      });
    });

    describe('Courtyard (second: treasure ratio)', () => {
      it('should include Courtyard when deck count is less than treasures/8', () => {
        mockMy.countInDeck.mockImplementation(card => card === cards.Courtyard ? 1 : 0);
        agent.countCardTypeInDeck.mockReturnValue(16);

        const priority = agent.gainPriority(mockState, mockMy);

        expect(priority).toContain(cards.Courtyard);
      });

      it('should not include Courtyard via treasure ratio when ratio is not met', () => {
        mockMy.countInDeck.mockImplementation(card => card === cards.Courtyard ? 2 : 0);
        agent.countCardTypeInDeck.mockReturnValue(16);

        const priority = agent.gainPriority(mockState, mockMy);

        // 2 < 16/8 = 2 is false; < 2 condition also false (2 < 2 is false)
        expect(priority).not.toContain(cards.Courtyard);
      });
    });

    describe('Silver (unconditional)', () => {
      it('should always include Silver unconditionally', () => {
        mockMy.countInDeck.mockImplementation(card => card === cards.Silver ? 5 : 0);
        agent.countCardTypeInDeck.mockReturnValue(0);

        const priority = agent.gainPriority(mockState, mockMy);

        expect(priority).toContain(cards.Silver);
      });
    });

    describe('Courtyard (third: fewer than 2)', () => {
      it('should include Courtyard when player has 1 in deck (< 2)', () => {
        mockMy.countInDeck.mockImplementation(card => card === cards.Courtyard ? 1 : 0);
        agent.countCardTypeInDeck.mockReturnValue(0);

        const priority = agent.gainPriority(mockState, mockMy);

        expect(priority).toContain(cards.Courtyard);
      });

      it('should not include Courtyard via < 2 condition when player has 2 or more', () => {
        mockMy.countInDeck.mockImplementation(card => card === cards.Courtyard ? 2 : 0);
        agent.countCardTypeInDeck.mockReturnValue(0);

        const priority = agent.gainPriority(mockState, mockMy);

        expect(priority).not.toContain(cards.Courtyard);
      });
    });

    describe('default start-of-game priority', () => {
      it('should produce correct default priority at start of game', () => {
        mockState.countInSupply.mockReturnValue(8);
        mockMy.countInDeck.mockReturnValue(0);
        agent.countCardTypeInDeck.mockReturnValue(0);

        const priority = agent.gainPriority(mockState, mockMy);

        // At start: no Gold, Province supply = 8, no Silver, no Courtyard, 0 treasures
        // Province: skipped (no Gold)
        // Duchy (<=4): skipped (supply=8)
        // Estate (<=2): skipped (supply=8)
        // Gold: pushed
        // Duchy (<=5): skipped (supply=8)
        // Silver (===0): pushed (no Silver)
        // Courtyard (<1): pushed (0 Courtyards)
        // Courtyard (treasure ratio): skipped (0 < 0 is false)
        // Silver: pushed (unconditional)
        // Courtyard (<2): pushed (0 < 2)
        expect(priority).toStrictEqual([
          cards.Gold,
          cards.Silver,
          cards.Courtyard,
          cards.Silver,
          cards.Courtyard
        ]);
      });
    });

    describe('priority ordering', () => {
      it('should place Province before Gold', () => {
        mockMy.countInDeck.mockImplementation(card => card === cards.Gold ? 1 : 0);
        mockState.countInSupply.mockReturnValue(8);
        agent.countCardTypeInDeck.mockReturnValue(0);

        const priority = agent.gainPriority(mockState, mockMy);

        expect(priority.indexOf(cards.Province)).toBeLessThan(priority.indexOf(cards.Gold));
      });

      it('should place Gold before unconditional Silver', () => {
        mockMy.countInDeck.mockImplementation(card => card === cards.Silver ? 1 : 0);
        mockState.countInSupply.mockReturnValue(8);
        agent.countCardTypeInDeck.mockReturnValue(0);

        const priority = agent.gainPriority(mockState, mockMy);

        expect(priority.indexOf(cards.Gold)).toBeLessThan(priority.indexOf(cards.Silver));
      });
    });
  });
});
