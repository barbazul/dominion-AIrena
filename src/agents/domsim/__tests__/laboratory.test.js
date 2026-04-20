// laboratory.test.js
import Laboratory from '../laboratory.js';
import cards from '../../../game/cards.js';

describe('Laboratory', () => {
  let laboratory;
  let mockState;
  let mockMy;

  beforeEach(() => {
    laboratory = new Laboratory();

    mockState = {
      countInSupply: jest.fn()
    };

    mockMy = {
      countInDeck: jest.fn()
    };
  });

  test('should have Laboratory as required card', () => {
    expect(laboratory.requires).toEqual([cards.Laboratory]);
  });

  test('should prioritize Province if Gold is in deck', () => {
    mockMy.countInDeck.mockReturnValueOnce(1); // Simulate Gold in deck
    mockState.countInSupply.mockReturnValue(Infinity); // Provinces not low
    const result = laboratory.gainPriority(mockState, mockMy);

    expect(result[0]).toBe(cards.Province);
  });

  test('should prioritize Duchy if 4 or fewer Provinces are in supply', () => {
    mockMy.countInDeck.mockReturnValue(0); // Gold not in deck
    mockState.countInSupply.mockReturnValueOnce(4); // 4 Provinces in supply
    const result = laboratory.gainPriority(mockState, mockMy);

    expect(result[0]).toBe(cards.Duchy);
  });

  test('should prioritize Estate if 2 or fewer Provinces are in supply', () => {
    mockMy.countInDeck.mockReturnValue(0); // Gold not in deck
    mockState.countInSupply
      .mockReturnValueOnce(2) // 2 Provinces in supply
      .mockReturnValueOnce(2) // 2 Provinces in supply
      .mockReturnValueOnce(Infinity);
    const result = laboratory.gainPriority(mockState, mockMy);

    expect(result[1]).toBe(cards.Estate);
  });

  test('should always prioritize Gold, Laboratory, and Silver in that order if no other conditions are met', () => {
    mockMy.countInDeck.mockReturnValue(0); // Gold not in deck
    mockState.countInSupply.mockReturnValue(Infinity); // Provinces fully stocked
    const result = laboratory.gainPriority(mockState, mockMy);

    expect(result).toEqual([cards.Gold, cards.Laboratory, cards.Silver]);
  });
});
