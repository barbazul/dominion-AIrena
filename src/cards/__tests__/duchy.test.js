import BasicAI from '../../agents/basicAI';
import Duchy from '../duchy';
import State from '../../game/state';

test('Duchy card definition', () => {
  const card = new Duchy();

  expect(card.cost).toBe(5);
  expect(card.vp).toBe(3);
  expect(card.isVictory()).toBe(true);
  expect(card.types).toHaveLength(1);
});

test('Duchy starting supply', () => {
  const card = new Duchy();
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
