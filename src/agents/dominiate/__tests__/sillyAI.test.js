import SillyAI from '../sillyAI.js';
import cards from '../../../game/cards.js';
import State from '../../../game/state.js';

const muteConfig = { log: () => {} };

test('SillyAI has no gain priority', () => {
  const agent = new SillyAI();

  expect(agent.gainPriority()).toEqual([]);
});

test('Gain Value is cost + random', () => {
  const agent = new SillyAI();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.rng = () => 0.5;

  expect(agent.gainValue(state, cards.Smithy, state.current)).toBe(4.5);
});