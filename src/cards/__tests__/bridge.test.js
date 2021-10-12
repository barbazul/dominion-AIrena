import Bridge, { bridgeCostModifier } from '../bridge';
import BasicAI from '../../agents/basicAI';
import State from '../../game/state';

test('Bridge card definition', () => {
  const card = new Bridge();

  expect(card.toString()).toBe('Bridge');
  expect(card.cost).toBe(4);
  expect(card.buys).toBe(1);
  expect(card.coins).toBe(1);
});

test('playEffect applies a costModifier', () => {
  const card = new Bridge();
  const state = new State();

  state.setUp([new BasicAI(), new BasicAI()]);
  card.playEffect(state);

  expect(state.costModifiers.length).toBe(1);
  expect(state.costModifiers[0].modifier).toBe(bridgeCostModifier);
  expect(state.costModifiers[0].source).toBe(card);
});

test('bridgeCostModifier reduces cost by 1', () => {
  expect(bridgeCostModifier(new Bridge())).toBe(-1);
});
