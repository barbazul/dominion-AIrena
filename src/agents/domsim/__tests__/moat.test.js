import Moat from '../moat.js';
import cards from '../../../game/cards.js';

describe('Moat', () => {
  let moatAgent;
  let mockState;
  let mockMy;

  beforeEach(() => {
    moatAgent = new Moat();
    mockState = {
      countInSupply: jest.fn()
    };
    mockMy = {
      countInDeck: jest.fn()
    };
  });

  describe('gainPriority', () => {
    it('should prioritize Province when total money is greater than 16', () => {
      // Mock getTotalMoney to return more than 16
      jest.spyOn(moatAgent, 'countCardTypeInDeck').mockReturnValue(17); // 17 Coppers
      jest.spyOn(moatAgent, 'getTotalMoney').mockReturnValue(17);
      mockState.countInSupply.mockReturnValue(8); // Full supply of provinces

      const priority = moatAgent.gainPriority(mockState, mockMy);

      expect(priority).toContain(cards.Province);
      expect(priority.indexOf(cards.Province)).toBe(0);
    });

    it('should prioritize Duchy when Province supply is 4 or less', () => {
      jest.spyOn(moatAgent, 'countCardTypeInDeck').mockReturnValue(10); // 10 Coppers
      jest.spyOn(moatAgent, 'getTotalMoney').mockReturnValue(10); // 10 Coppers
      mockState.countInSupply.mockImplementation((card) => {
        if (card === cards.Province) return 4;
        return 8;
      });

      const priority = moatAgent.gainPriority(mockState, mockMy);

      expect(priority).toContain(cards.Duchy);
      expect(priority.indexOf(cards.Duchy)).toBeLessThan(priority.indexOf(cards.Gold));
    });

    it('should prioritize Estate when Province supply is 2 or less', () => {
      jest.spyOn(moatAgent, 'countCardTypeInDeck').mockReturnValue(10); // 10 Coppers
      jest.spyOn(moatAgent, 'getTotalMoney').mockReturnValue(10); // 10 Coppers
      mockState.countInSupply.mockImplementation((card) => {
        if (card === cards.Province) return 2;
        return 8;
      });

      const priority = moatAgent.gainPriority(mockState, mockMy);

      expect(priority).toContain(cards.Estate);
    });

    it('should prioritize Moat when there are 10+ treasures and no Moats', () => {
      jest.spyOn(moatAgent, 'countCardTypeInDeck').mockReturnValue(10); // 10 Coppers
      jest.spyOn(moatAgent, 'getTotalMoney').mockReturnValue(10); // 10 Coppers
      mockMy.countInDeck.mockImplementation((card) => {
        if (card === cards.Moat) return 0;
        return 1;
      });

      const priority = moatAgent.gainPriority(mockState, mockMy);

      expect(priority).toContain(cards.Moat);
      expect(priority.indexOf(cards.Moat)).toBeLessThan(priority.indexOf(cards.Silver));
    });

    it('should prioritize Moat after Silver when less than 2 Moats in deck', () => {
      jest.spyOn(moatAgent, 'countCardTypeInDeck').mockReturnValue(8); // 7 Coppers + 1 Silver
      jest.spyOn(moatAgent, 'getTotalMoney').mockReturnValue(9); // 7 Coppers + 1 Silver
      mockMy.countInDeck.mockImplementation((card) => {
        if (card === cards.Moat) return 1;
        return 1;
      });

      const priority = moatAgent.gainPriority(mockState, mockMy);

      expect(priority).toContain(cards.Moat);
      expect(priority.indexOf(cards.Silver)).toBeLessThan(priority.indexOf(cards.Moat));
    });

    it('should not include Moat in priority when already having 2 Moats', () => {
      jest.spyOn(moatAgent, 'countCardTypeInDeck').mockReturnValue(7); // 7 Coppers
      jest.spyOn(moatAgent, 'getTotalMoney').mockReturnValue(7); // 7 Coppers
      mockMy.countInDeck.mockImplementation((card) => {
        if (card === cards.Moat) return 2;
        return 1;
      });

      const priority = moatAgent.gainPriority(mockState, mockMy);

      const moatIndexes = priority.filter(card => card === cards.Moat);
      expect(moatIndexes.length).toBe(0);
    });
  });
});