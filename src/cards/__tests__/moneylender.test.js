import BasicAI from '../../agents/basicAI';
import cards from '../../game/cards';
import State from '../../game/state';
import Moneylender from '../moneylender';

test('Moneylender card definition', () => {
  const card = new Moneylender();

  expect(card.toString()).toBe('Moneylender');
  expect(card.cost).toBe(4);
});

test('playEffect with Copper in hand calls for a trash choice', () => {
  const state = new State();
  const basicAI = new BasicAI();
  const card = new Moneylender();

  state.setUp([basicAI, basicAI], { log: () => {}, warn: () => {} });
  basicAI.choose = jest.fn(() => cards.Copper);
  state.current.hand = [cards.Copper];
  card.playEffect(state);

  expect(basicAI.choose).toHaveBeenCalledWith('trash', state, expect.arrayContaining([cards.Copper]));
});

test('playEffect generates coins and trashes Copper', () => {
  const state = new State();
  const basicAI = new BasicAI();
  const card = new Moneylender();

  state.setUp([basicAI, basicAI], { log: () => {}, warn: () => {} });
  basicAI.choose = jest.fn(() => cards.Copper);
  state.current.coins = 0;
  state.current.hand = [cards.Copper];
  state.trash = [];
  card.playEffect(state);

  expect(state.current.coins).toBe(3);
  expect(state.trash).toHaveLength(1);
  expect(state.trash).toContain(cards.Copper);
});

test('playEffect allows for null choice', () => {
  const state = new State();
  const basicAI = new BasicAI();
  const card = new Moneylender();

  state.setUp([basicAI, basicAI], { log: () => {}, warn: () => {} });
  basicAI.choose = jest.fn(() => cards.Copper);
  state.current.hand = [cards.Copper];
  card.playEffect(state);

  expect(basicAI.choose).toHaveBeenCalledWith('trash', state, expect.arrayContaining([null]));
});

test('playEffect has no effect when agent chooses null', () => {
  const state = new State();
  const basicAI = new BasicAI();
  const card = new Moneylender();

  state.setUp([basicAI, basicAI], { log: () => {}, warn: () => {} });
  basicAI.choose = jest.fn(() => null);
  state.current.coins = 0;
  state.current.hand = [cards.Copper];
  state.trash = [];
  card.playEffect(state);

  expect(state.current.coins).toBe(0);
  expect(state.trash).toHaveLength(0);
  expect(state.current.hand).toContain(cards.Copper);
});

test('playEffect has no effect without copper', () => {
  const state = new State();
  const basicAI = new BasicAI();
  const card = new Moneylender();

  state.setUp([basicAI, basicAI], { log: () => {}, warn: () => {} });
  basicAI.choose = jest.fn(() => cards.Copper);
  state.current.coins = 0;
  state.current.hand = [];
  state.trash = [];
  card.playEffect(state);

  expect(state.current.coins).toBe(0);
  expect(state.trash).toHaveLength(0);
  expect(basicAI.choose).not.toHaveBeenCalled();
});
