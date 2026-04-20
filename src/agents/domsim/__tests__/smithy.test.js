import Smithy from '../smithy.js';
import cards from '../../../game/cards.js';

describe('Smithy', () => {
  let smithy;
  let mockState;
  let mockPlayer;

  beforeEach(() => {
    smithy = new Smithy();
    mockState = {
      countInSupply: jest.fn()
    };
    mockPlayer = {
      countInDeck: jest.fn()
    };
  });

  describe('constructor', () => {
    it('should initialize with Smithy card requirement', () => {
      expect(smithy.requires).toEqual([cards.Smithy]);
    });
  });

  describe('gainPriority', () => {
    it('should prioritize Province when total money is greater than 15', () => {
      // Mock the getTotalMoney method
      smithy.getTotalMoney = jest.fn().mockReturnValue(16);
      mockState.countInSupply.mockReturnValue(8);
      jest.spyOn(smithy, 'countCardTypeInDeck').mockReturnValue(17);

      const priority = smithy.gainPriority(mockState, mockPlayer);

      expect(priority[0]).toBe(cards.Province);
    });

    it('should include Duchy when Province pile is at 4 or less', () => {
      smithy.getTotalMoney = jest.fn().mockReturnValue(10);
      mockState.countInSupply.mockReturnValue(4);
      jest.spyOn(smithy, 'countCardTypeInDeck').mockReturnValue(17);

      const priority = smithy.gainPriority(mockState, mockPlayer);

      expect(priority).toContain(cards.Duchy);
    });

    it('should include Estate when Province pile is at 2 or less', () => {
      smithy.getTotalMoney = jest.fn().mockReturnValue(10);
      mockState.countInSupply.mockReturnValue(2);
      jest.spyOn(smithy, 'countCardTypeInDeck').mockReturnValue(17);

      const priority = smithy.gainPriority(mockState, mockPlayer);

      expect(priority).toContain(cards.Estate);
    });

    it('should prioritize buying another Smithy based on treasure ratio', () => {
      smithy.getTotalMoney = jest.fn().mockReturnValue(10);
      mockState.countInSupply.mockReturnValue(8);
      mockPlayer.countInDeck.mockReturnValue(1); // 1 Smithy
      smithy.countCardTypeInDeck = jest.fn().mockReturnValue(22); // 22 Treasures

      const priority = smithy.gainPriority(mockState, mockPlayer);

      expect(priority).toContain(cards.Smithy);
    });

    it('should include basic treasures in priority list', () => {
      smithy.getTotalMoney = jest.fn().mockReturnValue(10);
      mockState.countInSupply.mockReturnValue(8);
      jest.spyOn(smithy, 'countCardTypeInDeck').mockReturnValue(17);

      const priority = smithy.gainPriority(mockState, mockPlayer);

      expect(priority).toContain(cards.Gold);
      expect(priority).toContain(cards.Silver);
    });

    it('should maintain correct priority order', () => {
      smithy.getTotalMoney = jest.fn().mockReturnValue(16);
      mockState.countInSupply.mockReturnValue(8);
      mockPlayer.countInDeck.mockReturnValue(0);
      smithy.countCardTypeInDeck = jest.fn().mockReturnValue(22);

      const priority = smithy.gainPriority(mockState, mockPlayer);

      expect(priority.indexOf(cards.Province)).toBeLessThan(priority.indexOf(cards.Gold));
      expect(priority.indexOf(cards.Gold)).toBeLessThan(priority.indexOf(cards.Silver));
    });
  });
});
