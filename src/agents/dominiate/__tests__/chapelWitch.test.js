import ChapelWitch from '../chapelWitch.js';
import cards from '../../../game/cards.js';
import State from '../../../game/state.js';

const muteConfig = { log: () => {} };

test('Chapel Witch strategy setup', () => {
  const agent = new ChapelWitch();

  expect(agent.toString()).toBe('Chapel Witch');
  expect(agent.requires).toEqual([cards.Chapel, cards.Witch]);
});

test('Starting gainPriority', () => {
  const agent = new ChapelWitch();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.current.coins = 4;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual([
    cards.Province,
    cards.Witch,
    cards.Gold,
    cards.Silver
  ]);
});

test('gainPriority wants only one Witch', () => {
  const agent = new ChapelWitch();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.current.draw.push(cards.Witch)

  const priority = agent.gainPriority(state, state.current);

  expect(priority).not.toContain(cards.Witch);
});

test('gainPriority wants Duchies when Duchy-dancing', () => {
  const agent = new ChapelWitch();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.current.coins = 4;
  state.gainsToEndGame = () => 5;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual([
    cards.Province,
    cards.Witch,
    cards.Duchy,
    cards.Gold,
    cards.Silver
  ]);
});

test('gainPriority wants Coppers on endgame', () => {
  const agent = new ChapelWitch();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.current.coins = 4;
  state.gainsToEndGame = () => 3;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual([
    cards.Province,
    cards.Witch,
    cards.Duchy,
    cards.Gold,
    cards.Silver,
    cards.Copper
  ]);
});

test('gainPriority wants Estates on endgame', () => {
  const agent = new ChapelWitch();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.current.coins = 4;
  state.gainsToEndGame = () => 2;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual([
    cards.Province,
    cards.Witch,
    cards.Duchy,
    cards.Estate,
    cards.Gold,
    cards.Silver,
    cards.Copper
  ]);
});

test('gainPriority prefers Chapel to Silver only with few coins', () => {
  const agent = new ChapelWitch();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.current.coins = 2;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual([
    cards.Province,
    cards.Witch,
    cards.Gold,
    cards.Chapel,
    cards.Silver
  ]);
});

test('gainPriority only wants 1 Chapel', () => {
  const agent = new ChapelWitch();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.current.coins = 2;
  state.current.draw.push(cards.Chapel);

  const priority = agent.gainPriority(state, state.current);

  expect(priority).not.toContain(cards.Chapel);
});

test('gainPriority only wants Chapel on first couple of turns', () => {
  const agent = new ChapelWitch();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.current.coins = 2;
  state.current.turnsTaken = 3;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).not.toContain(cards.Chapel);
});

test('Starting trashPriority', () => {
  const agent = new ChapelWitch();
  const state = new State();

  state.setUp([agent, agent], muteConfig);

  const priority = agent.trashPriority(state, state.current);

  expect(priority).toEqual([cards.Curse, cards.Estate, cards.Copper, cards.Estate]);
});

test('trashPriority keeps Estates over Copper on Duchy-dancing', () => {
  const agent = new ChapelWitch();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.gainsToEndGame = () => 4

  const priority = agent.trashPriority(state, state.current);

  expect(priority.indexOf(cards.Estate)).toBeGreaterThan(priority.indexOf(cards.Copper));
});


test('trashPriority keeps Coppers when low on money', () => {
  const agent = new ChapelWitch();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.current.getTotalMoney = () => 4;

  const priority = agent.trashPriority(state, state.current);

  expect(priority).not.toContain(cards.Copper);
});

test('Stop trashing Coppers after first Witch', () =>{
  const agent = new ChapelWitch();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.current.getTotalMoney = () => 5;
  state.current.draw.push(cards.Witch);

  const priority = agent.trashPriority(state, state.current);

  expect(priority).not.toContain(cards.Copper);
});

test('trashPriority keeps Estates on endgame', () => {
  const agent = new ChapelWitch();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.gainsToEndGame = () => 2

  const priority = agent.trashPriority(state, state.current);

  expect(priority).not.toContain(cards.Estate);
});
