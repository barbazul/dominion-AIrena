// witchAndMoatFor3or4.test.js
import WitchAndMoatFor3or4 from '../witchAndMoatFor3or4';
import cards from '../../../game/cards';

describe('WitchAndMoatFor3or4', () => {
  let state, my;

  beforeEach(() => {
    state = {
      gainsToEndGame: jest.fn(),
    };
    my = {
      countInDeck: jest.fn(),
    };
  });

  test('should prioritize Province when there is at least one Gold in deck', () => {
    my.countInDeck.mockImplementation((card) => (card === cards.Gold ? 1 : 0));
    state.gainsToEndGame.mockReturnValue(10);

    const instance = new WitchAndMoatFor3or4();
    const priority = instance.gainPriority(state, my);

    expect(priority).toContain(cards.Province);
  });

  test('should prioritize Duchy when gains to end game are 7 or less', () => {
    my.countInDeck.mockImplementation(() => 0);
    state.gainsToEndGame.mockReturnValue(7);

    const instance = new WitchAndMoatFor3or4();
    const priority = instance.gainPriority(state, my);

    expect(priority).toContain(cards.Duchy);
  });

  test('should prioritize Estate when gains to end game are 3 or less', () => {
    my.countInDeck.mockImplementation(() => 0);
    state.gainsToEndGame.mockReturnValue(3);

    const instance = new WitchAndMoatFor3or4();
    const priority = instance.gainPriority(state, my);

    expect(priority).toContain(cards.Estate);
  });

  test('should always prioritize Gold as a fallback', () => {
    my.countInDeck.mockImplementation(() => 0);
    state.gainsToEndGame.mockReturnValue(10);

    const instance = new WitchAndMoatFor3or4();
    const priority = instance.gainPriority(state, my);

    expect(priority).toContain(cards.Gold);
  });

  test('should prioritize Witch if less than 1 Witch is in the deck', () => {
    my.countInDeck.mockImplementation((card) => (card === cards.Witch ? 0 : 0));
    state.gainsToEndGame.mockReturnValue(10);

    const instance = new WitchAndMoatFor3or4();
    const priority = instance.gainPriority(state, my);

    expect(priority).toContain(cards.Witch);
  });

  test('should prioritize Moat if no Moats are in the deck', () => {
    my.countInDeck.mockImplementation((card) => (card === cards.Moat ? 0 : 0));
    state.gainsToEndGame.mockReturnValue(10);

    const instance = new WitchAndMoatFor3or4();
    const priority = instance.gainPriority(state, my);

    expect(priority).toContain(cards.Moat);
  });

  test('should prioritize Silver as a fallback', () => {
    my.countInDeck.mockImplementation(() => 0);
    state.gainsToEndGame.mockReturnValue(10);

    const instance = new WitchAndMoatFor3or4();
    const priority = instance.gainPriority(state, my);

    expect(priority).toContain(cards.Silver);
  });
});