import Conspirator from '../conspirator.js';
import State from '../../game/state.js';
import BasicAI from '../../agents/basicAI.js';

test('Conspirator card definition', () => {
  const card = new Conspirator();

  expect(card.toString()).toBe('Conspirator');
  expect(card.cost).toBe(4);
  expect(card.coins).toBe(2);
});

test('Conspirator is terminal before 3rd action', () => {
  const card = new Conspirator();
  const state = new State();

  state.setUp([new BasicAI(), new BasicAI()]);
  state.current.actionsPlayed = 1;

  expect(card.getActions(state)).toBe(0);
  expect(card.getCards(state)).toBe(0);
});

test('Conspirator is cantrip after 3rd action', () => {
  const card = new Conspirator();
  const state = new State();

  state.setUp([new BasicAI(), new BasicAI()]);
  state.current.actionsPlayed = 3;

  expect(card.getActions(state)).toBe(1);
  expect(card.getCards(state)).toBe(1);
});
