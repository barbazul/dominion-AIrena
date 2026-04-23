import cards from '../../../game/cards.js';
import BMMasquerade from '../bmMasquerade.js';
import State from '../../../game/state.js';

const muteConfig = { log: () => {} };

test('BMMasquerade strategy setup', () => {
  const agent = new BMMasquerade();

  expect(agent.toString()).toBe('BM Masquerade');
  expect(agent.requires).toEqual([cards.Masquerade]);
});

test('gainPriority at game start buys Masquerade before Silver', () => {
  const agent = new BMMasquerade();
  const state = new State();

  state.setUp([agent, agent], muteConfig);

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual([
    cards.Province,
    cards.Gold,
    cards.Masquerade,
    cards.Silver
  ]);
});

test('gainPriority does not include Masquerade when already in deck', () => {
  const agent = new BMMasquerade();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.current.draw.push(cards.Masquerade);

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual([
    cards.Province,
    cards.Gold,
    cards.Silver
  ]);
  expect(priority).not.toContain(cards.Masquerade);
});

test('gainPriority includes Duchy when gainsToEndGame <= 5', () => {
  const agent = new BMMasquerade();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.gainsToEndGame = () => 5;
  state.current.draw.push(cards.Masquerade);

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual([
    cards.Province,
    cards.Gold,
    cards.Duchy,
    cards.Silver
  ]);
});

test('gainPriority does not include Duchy when gainsToEndGame > 5', () => {
  const agent = new BMMasquerade();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.gainsToEndGame = () => 6;
  state.current.draw.push(cards.Masquerade);

  const priority = agent.gainPriority(state, state.current);

  expect(priority).not.toContain(cards.Duchy);
});

test('gainPriority includes both Duchy and Masquerade in end game without Masquerade', () => {
  const agent = new BMMasquerade();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.gainsToEndGame = () => 4;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual([
    cards.Province,
    cards.Gold,
    cards.Duchy,
    cards.Masquerade,
    cards.Silver
  ]);
});
