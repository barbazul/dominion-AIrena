import cards from '../../../game/cards.js';
import BMLibrary from '../bmLibrary.js';
import State from "../../../game/state";

const muteConfig = { log: () => {} };

test('BMLibrary strategy Setup', () => {
  const agent = new BMLibrary();

  expect(agent.toString()).toBe('BM Library');
  expect(agent.requires).toEqual([cards.Library]);
});

test('Stating gainPriority', () => {
  const agent = new BMLibrary();
  const state = new State();

  state.setUp([agent, agent], muteConfig);

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual([
    cards.Province,
    cards.Gold,
    cards.Library,
    cards.Silver
  ]);
});

test('gainPriority on duchy-dancing wants Duchy', () => {
  const agent = new BMLibrary();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.gainsToEndGame = () => 5;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual([
    cards.Province,
    cards.Duchy,
    cards.Gold,
    cards.Library,
    cards.Silver
  ]);
});

test('gainPriority on end game wants Estate', () => {
  const agent = new BMLibrary();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.gainsToEndGame = () => 2;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual([
    cards.Province,
    cards.Duchy,
    cards.Estate,
    cards.Gold,
    cards.Library,
    cards.Silver
  ]);
});
