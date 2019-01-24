import BasicAI from '../../agents/basicAI';
import State from '../../game/state';
import Card from '../card';
import Merchant, { merchantOnPlayHandler } from '../merchant';
import Silver from '../silver';

test('Merchant card definition', () => {
  const card = new Merchant();

  expect(card.toString()).toBe('Merchant');
  expect(card.cost).toBe(3);
  expect(card.cards).toBe(1);
  expect(card.actions).toBe(1);
});

test('playEffect sets the onPlay handler', () => {
  const card = new Merchant();
  const state = new State();

  card.playEffect(state);
  expect(state.onPlayHandlers).toContainEqual(merchantOnPlayHandler);
});

test('merchantOnPlayHandler gains coin on first Silver', () => {
  const state = new State();
  const silver = new Silver();

  state.setUp([new BasicAI(), new BasicAI()]);
  state.current.cardsPlayed = [silver];
  state.current.coins = 2;

  merchantOnPlayHandler(state, silver);
  expect(state.current.coins).toBe(3);
});

test('merchantOnPlayHandler does nothing on successive Silvers', () => {
  const state = new State();
  const silver = new Silver();

  state.setUp([new BasicAI(), new BasicAI()]);
  state.current.cardsPlayed = [silver, silver];
  state.current.coins = 5;

  merchantOnPlayHandler(state, silver);
  expect(state.current.coins).toBe(5);
});

test('merchantOnPlayHandler does nothing when playing a non-Silver', () => {
  const state = new State();
  const silver = new Silver();
  const other = new Card();

  state.setUp([new BasicAI(), new BasicAI()]);
  state.current.cardsPlayed = [silver];
  state.current.coins = 2;

  merchantOnPlayHandler(state, other);
  expect(state.current.coins).toBe(2);
});
