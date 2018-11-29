import BasicAI from '../../agents/basicAI';
import Card from '../card';
import State from '../../game/state';

test('Basic card has no types', () => {
  const card = new Card();

  expect(card.types).toHaveLength(0);
});

test('Basic card is not an action', () => {
  const card = new Card();

  expect(card.isAction()).toBe(false);
});

test('Basic card is not a treasure', () => {
  const card = new Card();

  expect(card.isTreasure()).toBe(false);
});

test('Basic card is not a victory card', () => {
  const card = new Card();

  expect(card.isVictory()).toBe(false);
});

test('Basic card is not an attack', () => {
  const card = new Card();

  expect(card.isAttack()).toBe(false);
});

test('Basic card is not a reaction', () => {
  const card = new Card();

  expect(card.isReaction()).toBe(false);
});

test('Basic card is not a curse', () => {
  const card = new Card();

  expect(card.isCurse()).toBe(false);
});

test('Basic card pile has 10 cards', () => {
  const card = new Card();
  const state = new State();

  state.setUp([new BasicAI(), new BasicAI()]);

  expect(card.startingSupply(state)).toBe(10);
});

test('Cards should resolve to their name when casting to string', () => {
  const card = new Card();

  card.name = 'Fake Card';
  expect(card.toString()).toBe('Fake Card');
});

test('Default card name is its class name', () => {
  const card = new Card();

  expect(card.toString()).toBe('Card');
});
