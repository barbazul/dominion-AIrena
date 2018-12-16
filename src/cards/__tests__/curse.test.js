import BasicAI from '../../agents/basicAI';
import Curse from '../curse';
import State from '../../game/state';

test('Curse card definition', () => {
  const card = new Curse();

  expect(card.toString()).toBe('Curse');
  expect(card.cost).toBe(0);
  expect(card.vp).toBe(-1);
  expect(card.isCurse()).toBe(true);
  expect(card.types).toHaveLength(1);
});

test('Curse starting supply', () => {
  const card = new Curse();
  const state = new State();
  const players = [new BasicAI(), new BasicAI()];

  // 2 players
  state.setUp(players);
  expect(card.startingSupply(state)).toBe(10);

  // 3 players
  players.push(new BasicAI());
  state.setUp(players);
  expect(card.startingSupply(state)).toBe(20);

  // 4 players
  players.push(new BasicAI());
  state.setUp(players);
  expect(card.startingSupply(state)).toBe(30);

  // 5 players
  players.push(new BasicAI());
  state.setUp(players);
  expect(card.startingSupply(state)).toBe(40);

  // 6 players
  players.push(new BasicAI());
  state.setUp(players);
  expect(card.startingSupply(state)).toBe(50);
});
