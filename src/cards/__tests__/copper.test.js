import BasicAI from '../../agents/basicAI';
import Copper from '../copper';
import State from '../../game/state';

test('Copper card definition', () => {
  const card = new Copper();

  expect(card.toString()).toBe('Copper');
  expect(card.cost).toBe(0);
  expect(card.coins).toBe(1);
  expect(card.isTreasure()).toBe(true);
  expect(card.types).toHaveLength(1);
});

test('Copper starting supply', () => {
  const card = new Copper();
  const state = new State();
  const players = [new BasicAI(), new BasicAI()];

  // 2 players
  state.setUp(players);
  expect(card.startingSupply(state)).toBe(46);

  // 3 players
  players.push(new BasicAI());
  state.setUp(players);
  expect(card.startingSupply(state)).toBe(39);

  // 4 players
  players.push(new BasicAI());
  state.setUp(players);
  expect(card.startingSupply(state)).toBe(32);

  // 5 players
  players.push(new BasicAI());
  state.setUp(players);
  expect(card.startingSupply(state)).toBe(85);

  // 6 players
  players.push(new BasicAI());
  state.setUp(players);
  expect(card.startingSupply(state)).toBe(78);
});
