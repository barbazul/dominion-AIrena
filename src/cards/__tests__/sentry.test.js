import BasicAI, { CHOICE_DISCARD, CHOICE_TRASH } from '../../agents/basicAI';
import cards from '../../game/cards';
import State from '../../game/state';
import Sentry from '../sentry';

test('Sentry card definition', () => {
  const card = new Sentry();

  expect(card.toString()).toBe('Sentry');
  expect(card.isAction()).toBeTruthy();
  expect(card.cost).toBe(5);
  expect(card.actions).toBe(1);
  expect(card.cards).toBe(1);
});

test('Sentry looks at top 2 cards and asks to trash both of them', () => {
  const card = new Sentry();
  const ai = new BasicAI();
  const state = new State();

  ai.choose = jest.fn(() => null);
  state.setUp([ai, ai]);
  state.current.draw = [cards.Copper, cards.Estate];
  card.playEffect(state);

  expect(ai.choose).toHaveBeenCalledWith(CHOICE_TRASH, state, [cards.Copper, null]);
  expect(ai.choose).toHaveBeenCalledWith(CHOICE_TRASH, state, [cards.Estate, null]);
});

test('Sentry trashes the chosen cards', () => {
  const card = new Sentry();
  const ai = new BasicAI();
  const state = new State();

  ai.choose = jest.fn((type, state, choices) => choices[0]);
  state.setUp([ai, ai]);
  state.current.draw = [cards.Copper, cards.Estate];
  card.playEffect(state);

  expect(ai.choose).toHaveBeenCalledWith(CHOICE_TRASH, state, [cards.Copper, null]);
  expect(ai.choose).toHaveBeenCalledWith(CHOICE_TRASH, state, [cards.Estate, null]);
  expect(state.trash).toContain(cards.Copper);
  expect(state.trash).toContain(cards.Estate);
});

test('Sentry asks to discard both cards if none is trashed', () => {
  const card = new Sentry();
  const ai = new BasicAI();
  const state = new State();

  ai.choose = jest.fn(() => null);
  state.setUp([ai, ai]);
  state.current.draw = [cards.Copper, cards.Estate];
  card.playEffect(state);

  expect(ai.choose).toHaveBeenCalledWith(CHOICE_TRASH, state, [cards.Copper, null]);
  expect(ai.choose).toHaveBeenCalledWith(CHOICE_TRASH, state, [cards.Estate, null]);
  expect(ai.choose).toHaveBeenCalledWith(CHOICE_DISCARD, state, [cards.Copper, null]);
  expect(ai.choose).toHaveBeenCalledWith(CHOICE_DISCARD, state, [cards.Estate, null]);
});

test('Sentry discards the chosen cards', () => {
  const card = new Sentry();
  const ai = new BasicAI();
  const state = new State();

  ai.choose = jest.fn((type, state, choices) => type === CHOICE_TRASH ? null : choices[0]);
  state.setUp([ai, ai]);
  state.current.draw = [cards.Copper, cards.Estate];
  state.current.discard = [];
  card.playEffect(state);

  expect(ai.choose).toHaveBeenCalledWith(CHOICE_TRASH, state, [cards.Copper, null]);
  expect(ai.choose).toHaveBeenCalledWith(CHOICE_TRASH, state, [cards.Estate, null]);
  expect(ai.choose).toHaveBeenCalledWith(CHOICE_DISCARD, state, [cards.Copper, null]);
  expect(ai.choose).toHaveBeenCalledWith(CHOICE_DISCARD, state, [cards.Estate, null]);
  expect(state.current.discard).toContain(cards.Copper);
  expect(state.current.discard).toContain(cards.Estate);
});

test('Sentry topdecks the remaining cards', () => {
  const card = new Sentry();
  const ai = new BasicAI();
  const state = new State();

  ai.choose = jest.fn(() => null);
  state.setUp([ai, ai]);
  state.current.draw = [cards.Copper, cards.Estate];
  state.current.discard = [];
  card.playEffect(state);

  expect(ai.choose).toHaveBeenCalledWith(CHOICE_TRASH, state, [cards.Copper, null]);
  expect(ai.choose).toHaveBeenCalledWith(CHOICE_TRASH, state, [cards.Estate, null]);
  expect(ai.choose).toHaveBeenCalledWith(CHOICE_DISCARD, state, [cards.Copper, null]);
  expect(ai.choose).toHaveBeenCalledWith(CHOICE_DISCARD, state, [cards.Estate, null]);
  expect(state.current.discard).not.toContain(cards.Copper);
  expect(state.current.discard).not.toContain(cards.Estate);
  expect(state.trash).not.toContain(cards.Copper);
  expect(state.trash).not.toContain(cards.Estate);
  expect(state.current.draw).toContain(cards.Copper);
  expect(state.current.draw).toContain(cards.Estate);
});
