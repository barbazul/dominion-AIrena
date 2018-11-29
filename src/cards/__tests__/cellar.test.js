import BasicAI from '../../agents/basicAI';
import Card from '../card';
import Cellar from '../cellar';
import State from '../../game/state';

test('Cellar card definition', () => {
  const card = new Cellar();

  expect(card.cost).toBe(2);
  expect(card.actions).toBe(1);
});

test('Play effect allows discard', () => {
  const card = new Cellar();
  const state = new State();
  const allowDiscardMock = jest.fn(() => []);

  state.allowDiscard = allowDiscardMock;
  state.setUp([ new BasicAI(), new BasicAI() ], { log: () => {} });
  card.playEffect(state);
  expect(allowDiscardMock).toHaveBeenCalledWith(state.current, Infinity);
});

test('Draw as many cards as discarded', () => {
  const card = new Cellar();
  const state = new State();
  const card1 = new Card();
  const card2 = new Card();
  const card3 = new Card();
  const card4 = new Card();
  const basicAi = new BasicAI();

  card1.name = 'Card 1';
  card2.name = 'Card 2';
  card3.name = 'Card 3';
  card4.name = 'Card 4';

  state.setUp([ basicAi, basicAi ], { log: () => {} });
  state.current.hand = [card1, card2];
  state.current.draw = [card3, card4];
  state.current.discard = [];
  card.playEffect(state);
  basicAi.discardPriority = () => {};
  basicAi.discardValue = () => 100; // Always discards

  expect(state.current.hand).toHaveLength(2);
  expect(state.current.discard).toHaveLength(2);
  expect(state.current.draw).toHaveLength(0);
});
