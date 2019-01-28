import BasicAI from '../../agents/basicAI';
import Player from '../../game/player';
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

test('onPlay resolves all basic effects', () => {
  const card = new Card();
  const state = new State();

  state.setUp([new BasicAI(), new BasicAI()]);
  state.current.actions = 0;
  state.current.coins = 0;
  state.current.buys = 0;
  card.actions = 1;
  card.coins = 2;
  card.buys = 3;
  card.cards = 0;
  card.onPlay(state);

  expect(state.current.actions).toBe(1);
  expect(state.current.coins).toBe(2);
  expect(state.current.buys).toBe(3);
});

test('onPlay draws cards', () => {
  const card = new Card();
  const state = new State();

  state.setUp([new BasicAI(), new BasicAI()]);
  card.cards = 3;
  state.current.drawCards = jest.fn(() => {});
  card.onPlay(state);

  expect(state.current.drawCards).toHaveBeenCalledWith(3);
});

test('onPlay triggers playEffect', () => {
  const card = new Card();
  const state = new State();

  state.setUp([new BasicAI(), new BasicAI()]);
  card.playEffect = jest.fn(card.playEffect);
  card.onPlay(state);

  expect(card.playEffect).toHaveBeenCalledWith(state);
});

test('onPlay triggers global onPlay handlers', () => {
  const state = new State();
  const card = new Card();
  const handler = jest.fn(() => {});

  state.setUp([new BasicAI(), new BasicAI()]);
  state.current.hand = [card];

  state.onPlayHandlers = [handler];

  card.onPlay(state);

  expect(handler).toHaveBeenCalledTimes(1);
  expect(handler).toHaveBeenCalledWith(state, card);
});

test('getVP returns the vp value by default', () => {
  const card = new Card();
  const player = new Player(new BasicAI(), () => {});

  card.vp = 5;

  expect(card.getVP(player)).toBe(5);
});
