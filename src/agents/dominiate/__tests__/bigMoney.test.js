import BigMoney from '../bigMoney.js';
import State from '../../../game/state.js';
import cards from '../../../game/cards.js';

const muteConfig = { log: () => {} };

test('gainPriority at game start', () => {
  const agent = new BigMoney();
  const state = new State();

  state.setUp([agent, agent], muteConfig);

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual([cards.Gold, cards.Silver]);
});

test('gainPriority wants Province after accumulating enough money', () => {
  const agent = new BigMoney();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.current.getTotalMoney = () => 99;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [
      cards.Province,
      cards.Gold,
      cards.Silver
    ]
  );
});

test('gainPriority wants Duchy second to Gold when on end game', () => {
  const agent = new BigMoney();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.gainsToEndGame = () => 6;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [
      cards.Gold,
      cards.Duchy,
      cards.Silver
    ]
  );
});

test('gainPriority wants Duchy when Duchy-dancing', () => {
  const agent = new BigMoney();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.gainsToEndGame = () => 4;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [
      cards.Duchy,
      cards.Gold,
      cards.Duchy,
      cards.Silver
    ]
  );
});

test('gainPriority wants Estate on final rounds', () => {
  const agent = new BigMoney();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.gainsToEndGame = () => 2;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [
      cards.Duchy,
      cards.Estate,
      cards.Gold,
      cards.Duchy,
      cards.Silver
    ]
  );
});
