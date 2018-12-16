import BasicAI from '../../agents/basicAI';
import Silver from '../silver';
import State from '../../game/state';

test('Silver card definition', () => {
  const card = new Silver();

  expect(card.toString()).toBe('Silver');
  expect(card.cost).toBe(3);
  expect(card.coins).toBe(2);
  expect(card.isTreasure()).toBe(true);
  expect(card.types).toHaveLength(1);
});

test('Silver starting supply', () => {
  const card = new Silver();
  const state = new State();
  const players = [new BasicAI(), new BasicAI()];

  // 2 players
  state.setUp(players);
  expect(card.startingSupply(state)).toBe(40);

  // 3 players
  players.push(new BasicAI());
  state.setUp(players);
  expect(card.startingSupply(state)).toBe(40);

  // 4 players
  players.push(new BasicAI());
  state.setUp(players);
  expect(card.startingSupply(state)).toBe(40);

  // 5 players
  players.push(new BasicAI());
  state.setUp(players);
  expect(card.startingSupply(state)).toBe(80);

  // 6 players
  players.push(new BasicAI());
  state.setUp(players);
  expect(card.startingSupply(state)).toBe(80);
});
