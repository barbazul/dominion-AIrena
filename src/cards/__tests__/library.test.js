import BasicAI from '../../agents/basicAI';
import State from '../../game/state';
import BasicAction from '../basicAction';
import Card from '../card';
import Library from '../library';

test('Library class definition', () => {
  const card = new Library();

  expect(card.toString()).toBe('Library');
  expect(card.cost).toBe(5);
});

test('playEffect gets cards one at a time up to 7', () => {
  const state = new State();
  const ai = new BasicAI();
  const card = new Library();

  state.setUp([ai, ai]);
  state.current.getCardsFromDeck = jest.fn(state.current.getCardsFromDeck);
  state.current.hand = [new Card(), new Card(), new Card(), new Card()];
  state.current.draw = [new Card(), new Card(), new Card(), new Card()];
  card.playEffect(state);

  expect(state.current.getCardsFromDeck).toHaveBeenCalledWith(1);
  expect(state.current.getCardsFromDeck).toHaveBeenCalledTimes(3);
  expect(state.current.hand).toHaveLength(7);
  expect(state.current.draw).toHaveLength(1);
});

test('Library stops drawing with no cards left', () => {
  const state = new State();
  const ai = new BasicAI();
  const card = new Library();

  state.setUp([ai, ai]);
  state.current.getCardsFromDeck = jest.fn(state.current.getCardsFromDeck);
  state.current.hand = [new Card(), new Card(), new Card(), new Card()];
  state.current.draw = [new Card()];
  state.current.discard = [];
  card.playEffect(state);

  expect(state.current.getCardsFromDeck).toHaveBeenCalledWith(1);
  expect(state.current.getCardsFromDeck).toHaveBeenCalledTimes(2);
  expect(state.current.hand).toHaveLength(5);
  expect(state.current.draw).toHaveLength(0);
});

test('When drawing actions, call for a discard choice', () => {
  const state = new State();
  const ai = new BasicAI();
  const card = new Library();
  const action = new BasicAction();

  state.setUp([ai, ai]);
  state.current.getCardsFromDeck = jest.fn(state.current.getCardsFromDeck);
  const aCard = new Card();
  state.current.hand = [aCard, aCard, aCard, aCard];
  state.current.draw = [action];
  state.current.discard = [];
  state.current.agent.choose = jest.fn(() => action);
  card.playEffect(state);

  expect(state.current.getCardsFromDeck).toHaveBeenCalledWith(1);
  expect(state.current.getCardsFromDeck).toHaveBeenCalledTimes(2);
  expect(state.current.agent.choose).toHaveBeenCalledWith('discard', state, [action, null]);
  expect(state.current.agent.choose).toHaveBeenCalledTimes(1);
  expect(state.current.hand).toHaveLength(4);
  expect(state.current.draw).toHaveLength(0);
  expect(state.current.discard).toHaveLength(1);
});
