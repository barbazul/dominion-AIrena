import cards from '../../game/cards.js';
import Courtyard from '../courtyard.js';
import State from '../../game/state.js';
import BasicAI, { CHOICE_TOPDECK } from '../../agents/basicAI.js';

test('Courtyard card definition', () => {
  const card = new Courtyard();

  expect(card.toString()).toBe('Courtyard');
  expect(card.cost).toBe(2);
  expect(card.cards).toBe(3);
});

test('playEffect requests a topdeck choice', () => {
  const card = new Courtyard();
  const state = new State();
  const ai = new BasicAI();

  ai.choose = jest.fn(() => cards.Estate);
  state.doTopdeck = jest.fn();
  state.setUp([ai, ai]);
  const hand = [cards.Estate, cards.Copper, cards.Copper];
  state.current.hand = hand;
  card.playEffect(state);

  expect(ai.choose).toHaveBeenCalledWith(CHOICE_TOPDECK, state, hand);
  expect(state.doTopdeck).toHaveBeenCalled();
});

test('playEffect does nothing on an empty hand', () => {
  const card = new Courtyard();
  const state = new State();
  const ai = new BasicAI();

  ai.choose = jest.fn();
  state.doTopdeck = jest.fn();
  state.setUp([ai, ai]);
  state.current.hand = [];
  card.playEffect(state);

  expect(ai.choose).not.toHaveBeenCalled();
  expect(state.doTopdeck).not.toHaveBeenCalled();
});
