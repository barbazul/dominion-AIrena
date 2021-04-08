import BasicAI, { CHOICE_TRASH } from '../../agents/basicAI';
import cards from '../../game/cards';
import Player from '../../game/player';
import State from '../../game/state';
import Bandit, { banditAttack } from '../bandit';
import Card from '../card';
import Gold from '../gold';
import Silver from '../silver';

const setUpState = function (state, card1, card2) {
  state.setUp([ new BasicAI(), new BasicAI() ], { log: () => {} });
  state.current.getCardsFromDeck = jest.fn(() => [card1, card2]);
  state.current.agent.choose = jest.fn(() => card2);
  state.current.discard = [];
  state.trash = [];
};

test('Bandit card definition', () => {
  const card = new Bandit();

  expect(card.toString()).toBe('Bandit');
  expect(card.cost).toBe(5);
});

test('playEffect gains a Gold', () => {
  const card = new Bandit();
  const state = new State();

  state.gainCard = jest.fn(() => {});
  state.setUp([new BasicAI(), new BasicAI()], { log: () => {} });
  card.playEffect(state);

  expect(state.gainCard).toHaveBeenCalledWith(state.current, cards.Gold);
});

test('playEffect attacks every opponent', () => {
  const state = new State();
  const basicAI = new BasicAI();
  const card = new Bandit();

  state.setUp([basicAI, basicAI], { log: () => {}, warn: () => {} });
  state.attackOpponents = jest.fn(() => {});
  card.playEffect(state);

  expect(state.attackOpponents).toHaveBeenCalledWith(banditAttack);
});

test('banditAttack discards top 2 cards', () => {
  const player = new Player(new BasicAI(), () => {});
  const state = new State();
  const card1 = new Card();
  const card2 = new Card();

  player.getCardsFromDeck = jest.fn(() => [card1, card2]);
  player.discard = [];
  banditAttack(player, state);

  expect(player.getCardsFromDeck).toHaveBeenCalledWith(2);
  expect(player.discard).toEqual([card1, card2]);
});

test('banditAttack causes to trash single treasure', () => {
  const state = new State();
  const card1 = new Silver();
  const card2 = new Card();
  let player;

  state.setUp([new BasicAI(), new BasicAI()], { log: () => {} });
  player = state.current;
  player.getCardsFromDeck = jest.fn(() => [card1, card2]);
  player.discard = [];
  state.trash = [];
  banditAttack(player, state);

  expect(player.getCardsFromDeck).toHaveBeenCalledWith(2);
  expect(player.discard).toEqual([card2]);
  expect(state.trash).toEqual([card1]);
});

test('banditAttack causes choice between multiple treasures', () => {
  const state = new State();
  const card1 = new Silver();
  const card2 = new Gold();

  setUpState(state, card1, card2);
  banditAttack(state.current, state);

  expect(state.current.getCardsFromDeck).toHaveBeenCalledWith(2);
  expect(state.current.agent.choose).toHaveBeenCalledWith(CHOICE_TRASH, state, [card1, card2]);
  expect(state.current.discard).toEqual([card1]);
  expect(state.trash).toEqual([card2]);
});

test('banditAttack does not trash Copper', () => {
  const state = new State();
  const card1 = cards.Copper;
  const card2 = cards.Copper;

  setUpState(state, card1, card2);
  banditAttack(state.current, state);

  expect(state.current.getCardsFromDeck).toHaveBeenCalledWith(2);
  expect(state.current.agent.choose).not.toHaveBeenCalled();
  expect(state.current.discard).toEqual([card1, card2]);
  expect(state.trash).toEqual([]);
});
