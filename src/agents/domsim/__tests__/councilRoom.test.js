import cards from '../../../game/cards.js';
import State from '../../../game/state.js';
import CouncilRoom from "../councilRoom.js";

describe('Council Room', () => {
  let ai;
  let state;

  let my;

  beforeEach(() => {
    ai = new CouncilRoom();
    state = new State();

    my = {
      countInDeck: jest.fn(),
    };
  })

  test('gainPriority at the beginning of the game', () => {
    ai.getTotalMoney = jest.fn().mockReturnValue(7); // Total money is 7 at beginning of game
    my.countInDeck = jest.fn().mockReturnValue(0); // Simulate not having bought cards
    state.countInSupply = jest.fn().mockReturnValue(8)
    const priority = ai.gainPriority(state, my);
    expect(priority).toEqual([cards.Gold, cards['Council Room'], cards['Council Room'], cards.Silver]);
  });

  test('gainPriority includes Province if player has Gold cards', () => {
    ai.getTotalMoney = jest.fn().mockReturnValue(7); // Total money is 7
    my.countInDeck = jest.fn().mockReturnValue(1); // Simulate having Gold cards
    const priority = ai.gainPriority(state, my);
    expect(priority).toContain(cards.Province);
  });

  test('gainPriority includes Duchy if Province supply is 4 or less', () => {
    ai.getTotalMoney = jest.fn().mockReturnValue(7); // Total money is 7
    state.countInSupply = jest.fn((cardType) => (cardType === cards.Province ? 4 : 10)); // Simulate Province supply
    my.countInDeck = jest.fn().mockReturnValue(0);
    const priority = ai.gainPriority(state, my);
    expect(priority).toContain(cards.Duchy);
    expect(priority.filter(card => card === cards.Duchy)).toHaveLength(2);
  });

  test('gainPriority includes Estate if Province supply is 2 or less', () => {
    ai.getTotalMoney = jest.fn().mockReturnValue(7); // Total money is 7
    state.countInSupply = jest.fn((cardType) => (cardType === cards.Province ? 2 : 10)); // Simulate Province supply
    my.countInDeck = jest.fn().mockReturnValue(0);
    const priority = ai.gainPriority(state, my);
    expect(priority).toContain(cards.Estate);
  });

  test('gainPriority includes Council Room if none are in the player deck', () => {
    ai.getTotalMoney = jest.fn().mockReturnValue(7); // Total money is 7
    my.countInDeck = jest.fn().mockReturnValue(0); // No Council Rooms
    const priority = ai.gainPriority(state, my);
    expect(priority).toContain(cards['Council Room']);
  });

  test('gainPriority includes Council Room when total money justifies getting another', () => {
    ai.getTotalMoney = jest.fn().mockReturnValue(26); // Total money is 26
    my.countInDeck = jest.fn((cardType) => (cardType === cards['Council Room'] ? 1 : 0)); // Has 1 Council Room
    const priority = ai.gainPriority(state, my);
    expect(priority).toContain(cards['Council Room']);
  });

  test('gainPriority does not include Duchy if Province supply is 7 or more', () => {
    ai.getTotalMoney = jest.fn().mockReturnValue(7); // Total money is 7
    state.countInSupply = jest.fn((cardType) => (cardType === cards.Province ? 7 : 10)); // Simulate Province supply
    my.countInDeck = jest.fn().mockReturnValue(0);
    const priority = ai.gainPriority(state, my);
    expect(priority).not.toContain(cards.Duchy);
  });
});
