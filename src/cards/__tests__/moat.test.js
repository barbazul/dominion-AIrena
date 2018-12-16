import BasicAI from '../../agents/basicAI';
import State from '../../game/state';
import Moat from '../moat';

test('Moat card definition', () => {
  const card = new Moat();

  expect(card.toString()).toBe('Moat');
  expect(card.cost).toBe(2);
  expect(card.cards).toBe(2);
  expect(card.isReaction()).toBe(true);
});

test('reactToAttack blocks attack', () => {
  const card = new Moat();
  const state = new State();
  const basicAI = new BasicAI();
  const attackEvent = { blocked: false };

  state.setUp([basicAI, basicAI], { log: () => {}, warn: () => {} });
  card.reactToAttack(state, state.current, attackEvent);
  expect(attackEvent.blocked).toBe(true);
});

test('Avoid log spam', () => {
  const card = new Moat();
  const state = new State();
  const basicAI = new BasicAI();
  const attackEvent = { blocked: true };
  const logMock = jest.fn(() => {});

  state.setUp([basicAI, basicAI], { log: logMock, warn: () => {} });
  card.reactToAttack(state, state.current, attackEvent);
  expect(logMock).not.toHaveBeenCalled();
});
