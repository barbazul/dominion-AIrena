import BasicAI from '../../agents/basicAI';
import State from '../../game/state';
import Card from '../card';
import Harbinger from '../harbinger';

test('Harbinger card definition', () => {
  const card = new Harbinger();

  expect(card.toString()).toBe('Harbinger');
  expect(card.cost).toBe(3);
  expect(card.actions).toBe(1);
  expect(card.cards).toBe(1);
});

test('Harbinger with empty dicard does not call for a choice', () => {
  const basicAI = new BasicAI();
  const state = new State();
  const card = new Harbinger();

  state.setUp([basicAI, basicAI], { log: () => {}, warn: () => {} });
  state.current.discard = [];
  state.current.agent.choose = jest.fn((type, state, choices) => choices[0]);
  card.playEffect(state);

  expect(state.current.agent.choose).not.toHaveBeenCalled();
});

test('Calls for a choice with all cards in discard', () => {
  const basicAI = new BasicAI();
  const state = new State();
  const card = new Harbinger();
  const card1 = new Card();
  const card2 = new Card();

  state.setUp([basicAI, basicAI], { log: () => {}, warn: () => {} });
  state.current.discard = [card1, card2];
  state.current.agent.choose = jest.fn((type, state, choices) => choices[0]);
  card.playEffect(state);

  expect(state.current.agent.choose).toHaveBeenCalledWith('topdeck', state, expect.arrayContaining([card1, card2]));
});

test('Topdeck choice allows for null option', () => {
  const basicAI = new BasicAI();
  const state = new State();
  const card = new Harbinger();
  const card1 = new Card();
  const card2 = new Card();

  state.setUp([basicAI, basicAI], { log: () => {}, warn: () => {} });
  state.current.discard = [card1, card2];
  state.current.agent.choose = jest.fn((type, state, choices) => choices[0]);
  card.playEffect(state);

  expect(state.current.agent.choose).toHaveBeenCalledWith('topdeck', state, expect.arrayContaining([null]));
});

test('Harbinger moves a card from discard to top of deck', () => {
  const basicAI = new BasicAI();
  const state = new State();
  const card = new Harbinger();
  const card1 = new Card();
  const card2 = new Card();
  const card3 = new Card();

  card1.name = 'Card 1';
  card2.name = 'Card 2';
  card3.name = 'Card 3';
  state.setUp([basicAI, basicAI], { log: () => {}, warn: () => {} });
  state.current.discard = [card1];
  state.current.draw = [card2, card3];
  state.current.agent.topdeckPriority = () => ['Card 1'];
  card.playEffect(state);
  expect(state.current.discard).toHaveLength(0);
  expect(state.current.draw).toEqual([card1, card2, card3]);
});

test('No effect when agent chooses null', () => {
  const basicAI = new BasicAI();
  const state = new State();
  const card = new Harbinger();
  const card1 = new Card();

  card1.name = 'Card 1';
  state.setUp([basicAI, basicAI], { log: () => {}, warn: () => {} });
  state.current.discard = [card1];
  state.current.draw = [];
  state.current.agent.topdeckPriority = () => [null];
  state.doTopdeck = jest.fn(state.doTopdeck);
  card.playEffect(state);
  expect(state.current.discard).toHaveLength(1);
  expect(state.current.draw).toHaveLength(0);
  expect(state.doTopdeck).not.toHaveBeenCalled();
});
