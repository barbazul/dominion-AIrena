import BasicAI from '../../agents/basicAI';
import Estate from '../estate';
import State from '../../game/state';

test('Estate card definition', () => {
  const card = new Estate();

  expect(card.toString()).toBe('Estate');
  expect(card.cost).toBe(2);
  expect(card.vp).toBe(1);
  expect(card.isVictory()).toBe(true);
  expect(card.types).toHaveLength(1);
});

test('Estate starting supply', () => {
  const card = new Estate();
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
