import BasicAI from '../../agents/basicAI';
import Card from '../../cards/card';
import State from '../state';

const basic2PlayerKingdom = {
  Curse: 10,
  Estate: 8,
  Duchy: 8,
  Province: 8,
  Copper: 46,
  Silver: 40,
  Gold: 30
};

const createPlayers = (quantiy) => {
  const players = [];

  if (!quantiy) {
    quantiy = 2;
  }

  for (let i = 0; i < quantiy; i++) {
    players.push(new BasicAI());
  }

  return players;
};

test('Setup returns the same instance', () => {
  const state = new State();
  const newState = state.setUp(createPlayers(2));

  expect(newState === state).toBe(true);
});

test('Cant create a game with less than 2 players', () => {
  const state = new State();

  expect(() => {
    state.setUp(createPlayers(1));
  }).toThrow();
});

test('Cant create a game with more than 6 players', () => {
  const state = new State();

  expect(() => {
    state.setUp(createPlayers(7));
  }).toThrow();
});

test('Empty kingdom on new instance', () => {
  const state = new State();

  expect(state.kingdom).toEqual({});
});

test('Default log is console', () => {
  const state = new State();

  state.setUp(createPlayers(2));
  expect(state.log).toBe(console.log);
});

test('Custom log', () => {
  const state = new State();
  const logger = () => {};
  const config = { log: logger };

  state.setUp(createPlayers(2), config);
  expect(state.log === logger).toBe(true);
});

test('Built kingdom has basic cards', () => {
  const state = new State();
  let kingdom;

  state.setUp(createPlayers(2));
  kingdom = state.buildKingdom([]);
  expect(kingdom).toMatchObject(basic2PlayerKingdom);
});

test('Cant build kingdom before setup', () => {
  const state = new State();

  expect(() => {
    state.buildKingdom([]);
  }).toThrow();
});

test('Basic kingdom cards after setup', () => {
  const state = new State();

  state.setUp(createPlayers(2));
  expect(state.kingdom).toMatchObject(basic2PlayerKingdom);
});

test('Built kingdom has selected cards', () => {
  const state = new State();
  let kingdom;

  state.setUp(createPlayers(2));
  kingdom = state.buildKingdom(['Village']);
  expect(kingdom).toMatchObject({ Village: 10 });
});

test('Kingdom contains required cards', () => {
  const state = new State();
  const config = { required: ['Village'] };

  state.setUp(createPlayers(2), config);
  expect(state.kingdom).toMatchObject({ Village: 10 });
});

test('Kingdom contains cards required by AI', () => {
  const state = new State();
  const players = createPlayers(2);

  players[0].requires = ['Village'];
  state.setUp(players);
  expect(state.kingdom).toMatchObject({ Village: 10 });
});

test('AllowDiscard returns empty array when allowing 0 cards', () => {
  const state = new State();
  const players = createPlayers(2);

  state.setUp(players);
  expect(state.allowDiscard(players[0], 0)).toHaveLength(0);
});

test('Default warn is console', () => {
  const state = new State();
  const originalLog = console.log;

  console.log = jest.fn();
  state.setUp(createPlayers(2));
  state.warn('A warning');
  expect(console.log).toHaveBeenCalledWith('WARN: A warning');
  console.log = originalLog;
});

test('Warn uses the configured function', () => {
  const state = new State();
  const players = createPlayers(2);
  const warnFunction = jest.fn(() => {});

  state.setUp(players, { warn: warnFunction });
  state.warn('Warning message');
  expect(warnFunction).toHaveBeenCalledWith('Warning message');
});

test('Do discard has no effect with wrong card', () => {
  const state = new State();
  const players = createPlayers(2);
  const card1 = new Card();
  const card2 = new Card();

  state.setUp(players, { log: () => {}, warn: () => {} });
  state.current.hand.push(card1);
  state.current.discard = [];
  state.doDiscard(state.current, card2);

  expect(state.current.hand.length).toBe(1);
  expect(state.current.discard.length).toBe(0);
});

test('Do discard moves the card from the hand to the discard', () => {
  const state = new State();
  const players = createPlayers(2);
  const card1 = new Card();
  const card2 = new Card();
  const card3 = new Card();

  state.setUp(players, { log: () => {}, warn: () => {} });
  card1.name = 'A Card';
  card2.name = 'Other Card';
  card3.name = 'Discard this Card';
  state.current.hand = [card1, card2, card3];
  state.current.discard = [];
  state.doDiscard(state.current, card3);

  expect(state.current.hand.length).toBe(2);
  expect(state.current.hand).not.toContain(card3);
  expect(state.current.discard.length).toBe(1);
  expect(state.current.discard).toContain(card3);
});

test('doTrash has no effect with wrong card', () => {
  const state = new State();
  const players = createPlayers(2);
  const card1 = new Card();
  const card2 = new Card();

  state.setUp(players, { log: () => {}, warn: () => {} });
  state.current.hand.push(card1);
  state.trash = [];
  state.doTrash(state.current, card2);
  expect(state.current.hand).toHaveLength(1);
  expect(state.trash).toHaveLength(0);
});

test('doTrash moves the card from the hand to the trash', () => {
  const state = new State();
  const players = createPlayers(2);
  const card1 = new Card();
  const card2 = new Card();

  state.setUp(players, { log: () => {}, warn: () => {} });
  state.current.hand = [card1, card2];
  state.trash = [];
  state.doTrash(state.current, card1);

  expect(state.current.hand).toHaveLength(1);
  expect(state.current.hand).not.toContain(card1);
  expect(state.trash).toHaveLength(1);
  expect(state.trash).toContain(card1);
});

test('AllowDiscard discards whole hand if agent chooses', () => {
  const state = new State();
  const players = createPlayers(2);
  const card1 = new Card();
  const card2 = new Card();
  let discarded;

  state.setUp(players, { log: () => {}, warn: () => {} });
  state.current.agent.discardValue = card => card ? 1 : 0; // Prefer discard over null
  state.current.hand.push(card1);
  state.current.hand.push(card2);
  state.current.discard = [];
  discarded = state.allowDiscard(state.current, 2);

  expect(discarded).toEqual([card1, card2]);
  expect(state.current.hand.length).toBe(0);
  expect(state.current.discard.length).toBe(2);
  expect(state.current.discard.indexOf(card1)).toBeGreaterThan(-1);
  expect(state.current.discard.indexOf(card2)).toBeGreaterThan(-1);
});

test('AllowDiscard has null as a valid choice', () => {
  const state = new State();
  const players = createPlayers(2);
  const card1 = new Card();

  state.setUp(players, { log: () => {}, warn: () => {} });
  state.current.hand.push(card1);
  state.current.agent.choose = jest.fn(state.current.agent.choose);
  state.current.agent.discardPriority = () => [ 'Worst Card', null, 'Best Card' ];
  state.allowDiscard(state.current, 2);
  expect(state.current.agent.choose).toHaveBeenCalledWith('discard', state, expect.arrayContaining([ null ]));
});

test('AllowDiscard interrupts on null', () => {
  const state = new State();
  const players = createPlayers(2);
  const card1 = new Card();
  const card2 = new Card();
  let discarded;

  state.setUp(players, { log: () => {}, warn: () => {} });
  state.current.agent.discardPriority = () => [ 'Worst Card', null, 'Best Card' ];
  card1.name = 'Worst Card';
  state.current.hand.push(card1);
  card2.name = 'Best Card';
  state.current.hand.push(card2);
  state.current.discard = [];
  discarded = state.allowDiscard(state.current, 2);

  expect(discarded).toEqual([card1]);
  expect(state.current.hand.length).toBe(1);
  expect(state.current.discard.length).toBe(1);
  expect(state.current.discard.indexOf(card1)).toBeGreaterThan(-1);
});
