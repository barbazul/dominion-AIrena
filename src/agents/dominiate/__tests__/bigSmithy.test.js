import BigSmithy from '../bigSmithy.js';
import cards from '../../../game/cards.js';
import State from '../../../game/state.js';

const muteConfig = { log: () => {} };

test('Big Smithy strategy Setup', () => {
  const agent = new BigSmithy();

  expect(agent.toString()).toBe('Big Smithy');
  expect(agent.requires).toEqual([cards.Smithy]);
});

test('gainPriority at game start', () => {
  const agent = new BigSmithy();
  const state = new State();

  state.setUp([agent, agent], muteConfig);

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [
      cards.Province, cards.Gold, cards.Smithy, cards.Silver
    ]
  );
});

test('gainPriority wants Province when there are few left', () => {
  const agent = new BigSmithy();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.kingdom[cards.Province] = 6;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [
      cards.Province,
      cards.Gold,
      cards.Smithy,
      cards.Silver
    ]
  );
});

test('gainPriority wants Duchies when Duchy-dancing', () => {
  const agent = new BigSmithy();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.gainsToEndGame = () => 5;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [
      cards.Province,
      cards.Duchy,
      cards.Gold,
      cards.Smithy,
      cards.Silver
    ]
  );
});

test('gainPriority wants Coppers on end game', () => {
  const agent = new BigSmithy();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.gainsToEndGame = () => 3;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [
      cards.Province,
      cards.Duchy,
      cards.Gold,
      cards.Smithy,
      cards.Silver,
      cards.Copper
    ]
  );
});

test('gainPriority wants Estates on end game', () => {
  const agent = new BigSmithy();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.gainsToEndGame = () => 2;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [
      cards.Province,
      cards.Duchy,
      cards.Estate,
      cards.Gold,
      cards.Smithy,
      cards.Silver,
      cards.Copper
    ]
  );
});

test('gainPriority wants 2nd Smith when deck is thick', () => {
  const agent = new BigSmithy();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.current.getDeck = () => [ // 16 cards. 1 is Smithy
    cards.Estate, cards.Estate, cards.Estate, cards.Smithy, cards.Copper,
    cards.Copper, cards.Copper, cards.Copper, cards.Copper, cards.Copper,
    cards.Copper, cards.Copper, cards.Copper, cards.Copper, cards.Copper,
    cards.Copper
  ];

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [
      cards.Province,
      cards.Gold,
      cards.Smithy,
      cards.Silver
    ]
  );
});

