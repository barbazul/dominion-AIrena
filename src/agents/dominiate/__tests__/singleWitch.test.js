import SingleWitch from '../singleWitch.js';
import cards from "../../../game/cards.js";
import State from "../../../game/state.js";

const muteConfig = { log: () => {} };
test('Single Witch setup', () => {
  const agent = new SingleWitch()

  expect(agent.toString()).toBe('Single Witch');
  expect(agent.requires).toEqual([cards.Witch]);
});

test('Starting gainPriority', () => {
  const agent = new SingleWitch();
  const state = new State();

  state.setUp([agent, agent], muteConfig);

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual([
    cards.Witch,
    cards.Gold,
    cards.Silver
  ]);
});

test('Wants Province after first Gold', () => {
  const agent = new SingleWitch();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.current.draw.push(cards.Gold);

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual([
    cards.Province,
    cards.Witch,
    cards.Gold,
    cards.Silver
  ]);

});

test('Only one Witch ever', () => {
  const agent = new SingleWitch();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.current.draw.push(cards.Witch);

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual([
    cards.Gold,
    cards.Silver
  ]);

});

test('Duchy dancing', () => {
  const agent = new SingleWitch();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.gainsToEndGame = () => 5;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual([
    cards.Witch,
    cards.Duchy,
    cards.Gold,
    cards.Silver
  ]);
});

test('Endgame wants Estate', () => {
  const agent = new SingleWitch();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.gainsToEndGame = () => 2;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual([
    cards.Witch,
    cards.Duchy,
    cards.Estate,
    cards.Gold,
    cards.Silver
  ]);
});
