import Mill from '../mill.js';
import State from '../../game/state.js';
import BasicAI from '../../agents/basicAI.js';

const muteConfig = { log: () => {}, warn: () => {} };

test('Mill card definition', () => {
  const card = new Mill();

  expect(card.toString()).toBe('Mill');
  expect(card.cost).toBe(4);
  expect(card.cards).toBe(1);
  expect(card.actions).toBe(1);
  expect(card.vp).toBe(1);
  expect(card.isAction()).toBe(true);
  expect(card.isVictory()).toBe(true);
  expect(card.types).toHaveLength(2);
});

test('Mill starting supply matches Estate: 8 for 2 players, 12 for 3 or more', () => {
  const card = new Mill();
  const state = new State();
  const players = [new BasicAI(), new BasicAI()];

  state.setUp(players, muteConfig);
  expect(card.startingSupply(state)).toBe(8);

  players.push(new BasicAI());
  state.setUp(players, muteConfig);
  expect(card.startingSupply(state)).toBe(12);
});

test('Mill playEffect asks player to opt in by discarding the first card', () => {
  const card = new Mill();
  const state = new State();

  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  state.allowDiscard = jest.fn(() => []);
  state.requireDiscard = jest.fn(() => []);
  card.playEffect(state);

  expect(state.allowDiscard).toHaveBeenCalledWith(state.current, 1);
});

test('Mill grants +$2 when player discards 2 cards', () => {
  const card = new Mill();
  const state = new State();

  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  state.allowDiscard = jest.fn(() => [{ toString: () => 'Copper' }]);
  state.requireDiscard = jest.fn(() => [{ toString: () => 'Estate' }]);

  const coinsBefore = state.current.coins;
  card.playEffect(state);

  expect(state.requireDiscard).toHaveBeenCalledWith(state.current, 1);
  expect(state.current.coins).toBe(coinsBefore + 2);
});

test('Mill grants no coins when player opts out', () => {
  const card = new Mill();
  const state = new State();

  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  state.allowDiscard = jest.fn(() => []);
  state.requireDiscard = jest.fn(() => []);

  const coinsBefore = state.current.coins;
  card.playEffect(state);

  expect(state.requireDiscard).not.toHaveBeenCalled();
  expect(state.current.coins).toBe(coinsBefore);
});

test('Mill grants no coins when player opts in but only has 1 card left to discard', () => {
  const card = new Mill();
  const state = new State();

  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  state.allowDiscard = jest.fn(() => [{ toString: () => 'Copper' }]);
  state.requireDiscard = jest.fn(() => []);

  const coinsBefore = state.current.coins;
  card.playEffect(state);

  expect(state.requireDiscard).toHaveBeenCalledWith(state.current, 1);
  expect(state.current.coins).toBe(coinsBefore);
});
