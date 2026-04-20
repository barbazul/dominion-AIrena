// witchFor3or4.test.js
import WitchFor3or4 from '../witchFor3or4';
import cards from '../../../game/cards';

describe('WitchFor3or4', () => {
  let player;
  let state;
  let my;

  beforeEach(() => {
    player = new WitchFor3or4();
    my = {
      countInDeck: jest.fn()
    };
    state = {
      gainsToEndGame: jest.fn()
    };
  });

  test('should have the correct name and requires attributes', () => {
    expect(player.name).toBe('Witch for 3 or 4');
    expect(player.requires).toEqual([cards.Witch]);
  });

  test('should prioritize Province if there is at least one Gold in deck', () => {
    my.countInDeck.mockReturnValueOnce(1);
    const priority = player.gainPriority(state, my);
    expect(priority).toContain(cards.Province);
  });

  test('should prioritize Duchy if gainsToEndGame is 7 or less', () => {
    state.gainsToEndGame.mockReturnValueOnce(7);
    const priority = player.gainPriority(state, my);
    expect(priority).toContain(cards.Duchy);
  });

  test('should prioritize Estate if gainsToEndGame is 3 or less', () => {
    state.gainsToEndGame.mockReturnValue(3);
    const priority = player.gainPriority(state, my);
    expect(priority).toContain(cards.Estate);
  });

  test('should prioritize Witch if less than 1 Witch is in the deck', () => {
    my.countInDeck.mockReturnValue(0);
    const priority = player.gainPriority(state, my);
    expect(priority).toContain(cards.Witch);
  });

  test('should always prioritize Gold', () => {
    const priority = player.gainPriority(state, my);
    expect(priority).toContain(cards.Gold);
  });

  test('should prioritize a second Witch if less than 2 Witches are in the deck', () => {
    my.countInDeck
      .mockImplementation(card => (card === cards.Witch ? 1 : 0)); // Second Witch count
    const priority = player.gainPriority(state, my);
    expect(priority.filter((card) => card === cards.Witch).length).toBe(1);
  });

  test('should include Silver as the lowest priority', () => {
    const priority = player.gainPriority(state, my);
    expect(priority[priority.length - 1]).toBe(cards.Silver);
  });
});
