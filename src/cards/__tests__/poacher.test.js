import BasicAI from '../../agents/basicAI';
import State from '../../game/state';
import Poacher from '../poacher';

test('Poacher card definition', () => {
  const card = new Poacher();

  expect(card.toString()).toBe('Poacher');
  expect(card.cost).toBe(4);
  expect(card.actions).toBe(1);
  expect(card.cards).toBe(1);
  expect(card.coins).toBe(1);
});

test('pllayEffect causes to discard a card per empty pile', () => {
  const card = new Poacher();
  const state = new State();

  state.setUp([new BasicAI(), new BasicAI()]);
  state.emptyPiles = () => ['Estate', 'Duchy', 'Curse', 'Copper', 'Silver'];
  state.requireDiscard = jest.fn(() => {});

  card.playEffect(state);

  expect(state.requireDiscard).toHaveBeenCalledWith(state.current, 5);
});
