import Farm from '../farm.js';
import State from '../../game/state.js';
import BasicAI from '../../agents/basicAI.js';

test('Farmm card definition', () => {
  const card = new Farm();

  expect(card.toString()).toBe('Farm');
  expect(card.cost).toBe(6);
  expect(card.coins).toBe(2);
  expect(card.vp).toBe(2);
  expect(card.isVictory()).toBe(true);
  expect(card.isTreasure()).toBe(true);
  expect(card.types).toHaveLength(2);
});

test('Farm starting supply', () => {
  const card = new Farm();
  const state = new State();
  const players = [new BasicAI(), new BasicAI()];

  // 2 players
  state.setUp(players);
  expect(card.startingSupply(state)).toBe(8);

  // 3 players
  players.push(new BasicAI());
  state.setUp(players);
  expect(card.startingSupply(state)).toBe(12);

  // 4 players
  players.push(new BasicAI());
  state.setUp(players);
  expect(card.startingSupply(state)).toBe(12);

  // 5 players
  players.push(new BasicAI());
  state.setUp(players);
  expect(card.startingSupply(state)).toBe(12);

  // 6 players
  players.push(new BasicAI());
  state.setUp(players);
  expect(card.startingSupply(state)).toBe(12);
});
