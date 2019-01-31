import BasicAI from '../../agents/basicAI';
import Player from '../../game/player';
import State from '../../game/state';
import Card from '../card';
import Militia, { militiaAttack } from '../militia';

test('Militia card definition', () => {
  const card = new Militia();

  expect(card.toString()).toBe('Militia');
  expect(card.cost).toBe(4);
  expect(card.coins).toBe(2);
});

test('playEffect attacks opponents', () => {
  const state = new State();
  const basicAI = new BasicAI();
  const card = new Militia();

  state.setUp([basicAI, basicAI], { log: () => {}, warn: () => {} });
  state.attackOpponents = jest.fn(() => {});
  card.playEffect(state);

  expect(state.attackOpponents).toHaveBeenCalledWith(militiaAttack);
});

test('militiaAttack does nothing on a small hand', () => {
  const state = new State();
  const opp = new Player(new BasicAI(), () => {});

  opp.hand = [new Card(), new Card(), new Card()];
  state.requireDiscard = jest.fn(state.requireDiscard);
  militiaAttack(opp, state);

  expect(state.requireDiscard).not.toHaveBeenCalled();
});

test('militiaAttack requires discard down to 3 cards', () => {
  const state = new State();
  const opp = new Player(new BasicAI(), () => {});

  opp.hand = [new Card(), new Card(), new Card(), new Card(), new Card()];
  state.requireDiscard = jest.fn(() => {});
  militiaAttack(opp, state);

  expect(state.requireDiscard).toHaveBeenCalledWith(opp, 2);
});
