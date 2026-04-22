import cards from '../../game/cards.js';
import Ironworks from '../ironworks.js';
import State from '../../game/state.js';
import BasicAI from '../../agents/basicAI.js';

const muteConfig = { log: () => {}, warn: () => {} };

test('Ironworks card definition', () => {
  const card = new Ironworks();

  expect(card.toString()).toBe('Ironworks');
  expect(card.cost).toBe(4);
  expect(card.isAction()).toBe(true);
});

test('Ironworks gains a card costing up to 4', () => {
  const card = new Ironworks();
  const state = new State();

  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  state.gainOneOf = jest.fn(() => null);

  card.playEffect(state);

  const [, choices] = state.gainOneOf.mock.calls[0];
  expect(choices.every(c => c.getCost(state) <= 4)).toBe(true);
  expect(choices.some(c => c.getCost(state) > 4)).toBe(false);
});

test('Ironworks grants +1 Action when an Action card is gained', () => {
  const card = new Ironworks();
  const state = new State();

  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  state.gainOneOf = jest.fn(() => cards.Village);

  const actionsBefore = state.current.actions;
  card.playEffect(state);

  expect(state.current.actions).toBe(actionsBefore + 1);
});

test('Ironworks grants +1 Coin when a Treasure card is gained', () => {
  const card = new Ironworks();
  const state = new State();

  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  state.gainOneOf = jest.fn(() => cards.Silver);

  const coinsBefore = state.current.coins;
  card.playEffect(state);

  expect(state.current.coins).toBe(coinsBefore + 1);
});

test('Ironworks grants +1 Card when a Victory card is gained', () => {
  const card = new Ironworks();
  const state = new State();

  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  state.gainOneOf = jest.fn(() => cards.Estate);
  state.current.drawCards = jest.fn();

  card.playEffect(state);

  expect(state.current.drawCards).toHaveBeenCalledWith(1);
});

test('Ironworks filters out empty piles', () => {
  const card = new Ironworks();
  const state = new State();

  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  state.kingdom = { Village: 0 };
  state.gainOneOf = jest.fn(() => null);

  card.playEffect(state);

  expect(state.gainOneOf).toHaveBeenCalledWith(state.current, []);
});

test('Ironworks grants no bonus when nothing is gained', () => {
  const card = new Ironworks();
  const state = new State();

  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  state.gainOneOf = jest.fn(() => null);

  const actionsBefore = state.current.actions;
  const coinsBefore = state.current.coins;
  state.current.drawCards = jest.fn();

  card.playEffect(state);

  expect(state.current.actions).toBe(actionsBefore);
  expect(state.current.coins).toBe(coinsBefore);
  expect(state.current.drawCards).not.toHaveBeenCalled();
});

test('Ironworks grants +1 Action and +1 Card for an Action-Victory card', () => {
  const card = new Ironworks();
  const state = new State();

  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  const dualTypeCard = { isAction: () => true, isTreasure: () => false, isVictory: () => true };
  state.gainOneOf = jest.fn(() => dualTypeCard);
  state.current.drawCards = jest.fn();

  const actionsBefore = state.current.actions;
  card.playEffect(state);

  expect(state.current.actions).toBe(actionsBefore + 1);
  expect(state.current.drawCards).toHaveBeenCalledWith(1);
});
