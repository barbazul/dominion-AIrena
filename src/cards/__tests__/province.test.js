import BasicAI from '../../agents/basicAI';
import Province from '../province';
import State from '../../game/state';

test('Province card definition', () => {
  const card = new Province();

  expect(card.toString()).toBe('Province');
  expect(card.cost).toBe(8);
  expect(card.vp).toBe(6);
  expect(card.isVictory()).toBe(true);
  expect(card.types).toHaveLength(1);
});

test('Province starting supply', () => {
  const card = new Province();
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
  expect(card.startingSupply(state)).toBe(15);

  // 6 players
  players.push(new BasicAI());
  state.setUp(players);
  expect(card.startingSupply(state)).toBe(18);
});
