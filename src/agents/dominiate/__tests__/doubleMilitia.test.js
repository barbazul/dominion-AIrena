import DoubleMilitia from "../doubleMilitia";
import cards from "../../../game/cards";
import State from "../../../game/state";

const muteConfig = { log: () => {} };

test('Double Militia strategy setup', () => {
  const agent = new DoubleMilitia();

  expect(agent.toString()).toBe('Double Militia');
  expect(agent.requires).toEqual([cards.Militia]);
});

test('Starting gainPriority', () => {
  const agent = new DoubleMilitia();
  const state = new State();

  state.setUp([agent, agent], muteConfig);

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual([
    cards.Province,
    cards.Militia,
    cards.Gold,
    cards.Silver
  ]);
});

test('Duchy dancing', () => {
  const agent = new DoubleMilitia();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.gainsToEndGame = () => 5;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual([
    cards.Province,
    cards.Duchy,
    cards.Militia,
    cards.Gold,
    cards.Silver
  ]);
});

test('Enough Militias', () => {
  const agent = new DoubleMilitia();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.current.draw.push(...[cards.Militia, cards.Militia]);

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual([
    cards.Province,
    cards.Gold,
    cards.Silver
  ]);
});

test('Endgame wants Coppers', () => {
  const agent = new DoubleMilitia();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.gainsToEndGame = () => 3;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual([
    cards.Province,
    cards.Duchy,
    cards.Militia,
    cards.Gold,
    cards.Silver,
    cards.Copper
  ]);
});

test('Endgame wants Estates', () => {
  const agent = new DoubleMilitia();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.gainsToEndGame = () => 2;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual([
    cards.Province,
    cards.Duchy,
    cards.Militia,
    cards.Estate,
    cards.Gold,
    cards.Silver,
    cards.Copper
  ]);
});
