import MoneylenderWitch from '../moneylenderWitch.js';
import cards from '../../../game/cards.js';
import State from '../../../game/state.js';

const muteConfig = { log: () => {} };

test('Double Witch strategy setup', () => {
  const agent = new MoneylenderWitch();

  expect(agent.toString()).toBe('Moneylender Witch');
  expect(agent.requires).toEqual([cards.Moneylender, cards.Witch]);
});

test('Starting gainPriority', () => {
  const agent = new MoneylenderWitch();
  const state = new State();

  state.setUp([agent, agent], muteConfig);

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual([
    cards.Witch,
    cards.Gold,
    cards.Moneylender,
    cards.Silver
  ]);
});

test('Wants Province after first Gold', () => {
  const agent = new MoneylenderWitch();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.current.draw.push(cards.Gold);

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual([
    cards.Province,
    cards.Witch,
    cards.Gold,
    cards.Moneylender,
    cards.Silver
  ]);
});

test('Stop buying Witch after the second', () => {
  const agent = new MoneylenderWitch();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.current.draw.push(cards.Witch, cards.Witch);

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual([
    cards.Gold,
    cards.Moneylender,
    cards.Silver
  ]);
});

test('Duchy dancing', () => {
  const agent = new MoneylenderWitch();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.gainsToEndGame = () => 5;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual([
    cards.Witch,
    cards.Duchy,
    cards.Gold,
    cards.Moneylender,
    cards.Silver
  ]);
});

test('Endgame wants Estate', () => {
  const agent = new MoneylenderWitch();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.gainsToEndGame = () => 2;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual([
    cards.Witch,
    cards.Duchy,
    cards.Estate,
    cards.Gold,
    cards.Moneylender,
    cards.Silver
  ]);
});

test('Stop Buying Moneylender after first', () => {
  const agent = new MoneylenderWitch();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.current.draw.push(cards.Moneylender);

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual([
    cards.Witch,
    cards.Gold,
    cards.Silver
  ]);
});
