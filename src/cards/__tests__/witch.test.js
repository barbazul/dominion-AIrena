import BasicAI from '../../agents/basicAI';
import cards from '../../game/cards';
import State from '../../game/state';
import Witch from '../witch';

test('Witch card definition', () => {
  const card = new Witch();

  expect(card.toString()).toBe('Witch');
  expect(card.cost).toBe(5);
  expect(card.cards).toBe(2);
});

test('playEffect attacks opponents', () => {
  const state = new State();
  const basicAI = new BasicAI();
  const card = new Witch();

  state.setUp([basicAI, basicAI], { log: () => {}, warn: () => {} });
  state.attackOpponents = jest.fn(() => {});
  card.playEffect(state);

  expect(state.attackOpponents).toHaveBeenCalledWith(card.witchAttack);
});

test('witchAttack causes opponent to gain curse', () => {
  const state = new State();
  const basicAI = new BasicAI();
  const card = new Witch();

  state.setUp([basicAI, basicAI], { log: () => {}, warn: () => {} });
  state.gainCard = jest.fn(() => {});
  card.witchAttack(state.current, state);

  expect(state.gainCard).toHaveBeenCalledWith(state.current, cards.Curse);
});
