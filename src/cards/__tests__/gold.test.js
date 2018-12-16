import BasicAI from '../../agents/basicAI';
import Gold from '../gold';
import State from '../../game/state';

test('Gold card definition', () => {
  const card = new Gold();

  expect(card.toString()).toBe('Gold');
  expect(card.cost).toBe(6);
  expect(card.coins).toBe(3);
  expect(card.isTreasure()).toBe(true);
  expect(card.types).toHaveLength(1);
});

test('Gold starting supply', () => {
  const card = new Gold();
  const state = new State();
  const players = [new BasicAI(), new BasicAI()];

  // 2 players
  state.setUp(players);
  expect(card.startingSupply(state)).toBe(30);

  // 3 players
  players.push(new BasicAI());
  state.setUp(players);
  expect(card.startingSupply(state)).toBe(30);

  // 4 players
  players.push(new BasicAI());
  state.setUp(players);
  expect(card.startingSupply(state)).toBe(30);

  // 5 players
  players.push(new BasicAI());
  state.setUp(players);
  expect(card.startingSupply(state)).toBe(60);

  // 6 players
  players.push(new BasicAI());
  state.setUp(players);
  expect(card.startingSupply(state)).toBe(60);
});
