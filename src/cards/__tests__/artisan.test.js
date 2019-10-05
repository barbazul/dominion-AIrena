import BasicAI, { CHOICE_DISCARD, CHOICE_GAIN } from '../../agents/basicAI';
import cards from '../../game/cards';
import State from '../../game/state';
import Artisan from '../artisan';

let setUpState = function (choice) {
  const state = new State();
  const card = new Artisan();

  state.setUp([new BasicAI(), new BasicAI()]);
  state.current.hand = [cards.Copper, cards.Estate];
  state.current.agent.choose = jest.fn(() => choice);
  state.gainCard = jest.fn(state.gainCard);
  state.doTopdeck = jest.fn(state.doTopdeck);
  return { state, card };
};

test('Artisan card definition', () => {
  const card = new Artisan();

  expect(card.toString()).toBe('Artisan');
  expect(card.cost).toBe(6);
  expect(card.isAction()).toBe(true);
});

test('Play effect calls for gain choice', () => {
  const state = new State();
  const card = new Artisan();

  state.setUp([new BasicAI(), new BasicAI()]);
  state.current.agent.choose = jest.fn(() => cards.Estate);

  card.playEffect(state);

  expect(state.current.agent.choose).toHaveBeenCalledWith(
    CHOICE_GAIN,
    state,
    expect.arrayContaining([cards.Curse, cards.Estate, cards.Duchy, cards.Copper, cards.Silver])
  );
});

test('Can only gain $5 or less', () => {
  const state = new State();
  const card = new Artisan();

  state.setUp([new BasicAI(), new BasicAI()]);
  state.current.agent.choose = jest.fn(() => cards.Estate);

  card.playEffect(state);

  expect(state.current.agent.choose).toHaveBeenCalledWith(
    CHOICE_GAIN,
    state,
    expect.not.arrayContaining([cards.Province, cards.Gold])
  );
});

test('Cannot gain form empty pile', () => {
  const state = new State();
  const card = new Artisan();

  state.setUp([new BasicAI(), new BasicAI()]);
  state.current.agent.choose = jest.fn(() => cards.Estate);
  state.kingdom['Copper'] = 0;

  card.playEffect(state);

  expect(state.current.agent.choose).toHaveBeenCalledWith(
    CHOICE_GAIN,
    state,
    expect.not.arrayContaining([cards.Copper])
  );
});

test('Gain chosen card to hand', () => {
  const choice = cards.Estate;
  const { state, card } = setUpState(choice);

  card.playEffect(state);

  expect(state.gainCard).toHaveBeenCalledWith(state.current, choice, 'hand');
});

test('Played with no valid targets gains nothing', () => {
  const choice = null;
  const { state, card } = setUpState(choice);

  card.playEffect(state);

  expect(state.gainCard).not.toHaveBeenCalled();
});

test('Trigger a topdeck choice', () => {
  const choice = cards.Estate;
  const { state, card } = setUpState(choice);

  card.playEffect(state);

  expect(state.current.agent.choose).toHaveBeenCalledWith(CHOICE_DISCARD, state, [cards.Estate, cards.Copper]);
});

test('Topdeck chosen card', () => {
  const choice = cards.Estate;
  const { state, card } = setUpState(choice);

  card.playEffect(state);

  expect(state.doTopdeck).toHaveBeenCalledWith(state.current, choice);
});
