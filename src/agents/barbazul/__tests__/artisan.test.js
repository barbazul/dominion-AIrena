import Artisan from '../artisan.js';
import cards from '../../../game/cards.js';
import State from '../../../game/state.js';

const muteConfig = { log: () => {} };

test('Artisan strategy setup', () => {
  const agent = new Artisan();

  expect(agent.toString()).toBe('Artisan');
  expect(agent.requires).toEqual([cards.Artisan]);
});

test('Starting gainPriority', () => {
  const agent = new Artisan();
  const state = new State();

  state.setUp([agent, agent], muteConfig);

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual([
    cards.Artisan,
    cards.Artisan,
    cards.Gold,
    cards.Silver
  ]);
});
