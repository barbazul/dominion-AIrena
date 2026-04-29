import BasicAI, { CHOICE_MINION } from '../../agents/basicAI';
import Player from '../../game/player';
import State from '../../game/state';
import Card from '../card';
import Minion, { minionAttack, MINION_COINS, MINION_CARDS } from '../minion';

const muteConfig = { log: () => {}, warn: () => {} };

test('Minion card definition', () => {
  const card = new Minion();

  expect(card.toString()).toBe('Minion');
  expect(card.cost).toBe(5);
  expect(card.actions).toBe(1);
  expect(card.isAction()).toBe(true);
  expect(card.isAttack()).toBe(true);
});

test('playEffect chooses between coins and cards', () => {
  const state = new State();
  const card = new Minion();

  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  state.current.agent.choose = jest.fn(() => MINION_COINS);

  card.playEffect(state);

  expect(state.current.agent.choose).toHaveBeenCalledWith(
    CHOICE_MINION,
    state,
    [MINION_COINS, MINION_CARDS]
  );
});

test('coins choice gives +$2 and does not attack', () => {
  const state = new State();
  const card = new Minion();

  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  state.current.coins = 0;
  state.current.agent.choose = jest.fn(() => MINION_COINS);
  state.attackOpponents = jest.fn(() => {});

  card.playEffect(state);

  expect(state.current.coins).toBe(2);
  expect(state.attackOpponents).not.toHaveBeenCalled();
});

test('cards choice discards hand and draws 4', () => {
  const state = new State();
  const card = new Minion();

  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  state.current.hand = [new Card(), new Card(), new Card()];
  state.current.agent.choose = jest.fn(() => MINION_CARDS);
  state.current.drawCards = jest.fn(() => {});
  state.requireDiscard = jest.fn(() => {});
  state.attackOpponents = jest.fn(() => {});

  card.playEffect(state);

  expect(state.requireDiscard).toHaveBeenCalledWith(state.current, 3);
  expect(state.current.drawCards).toHaveBeenCalledWith(4);
  expect(state.attackOpponents).toHaveBeenCalledWith(minionAttack);
});

test('minionAttack does nothing when opponent has fewer than 5 cards', () => {
  const state = new State();
  const opp = new Player(new BasicAI(), () => {});

  opp.hand = [new Card(), new Card(), new Card(), new Card()];
  state.requireDiscard = jest.fn(() => {});
  minionAttack(opp, state);

  expect(state.requireDiscard).not.toHaveBeenCalled();
});

test('minionAttack discards hand and draws 4 when opponent has 5 or more cards', () => {
  const state = new State();
  const opp = new Player(new BasicAI(), () => {});

  opp.hand = [new Card(), new Card(), new Card(), new Card(), new Card()];
  opp.drawCards = jest.fn(() => {});
  state.requireDiscard = jest.fn(() => {});

  minionAttack(opp, state);

  expect(state.requireDiscard).toHaveBeenCalledWith(opp, 5);
  expect(opp.drawCards).toHaveBeenCalledWith(4);
});

test('minionAttack triggers with exactly 5 cards', () => {
  const state = new State();
  const opp = new Player(new BasicAI(), () => {});

  opp.hand = [new Card(), new Card(), new Card(), new Card(), new Card()];
  opp.drawCards = jest.fn(() => {});
  state.requireDiscard = jest.fn(() => {});

  minionAttack(opp, state);

  expect(state.requireDiscard).toHaveBeenCalled();
});
