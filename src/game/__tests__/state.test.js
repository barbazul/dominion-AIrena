import BasicAI from '../../agents/basicAI';
import BasicAction from '../../cards/basicAction';
import Card from '../../cards/card';
import cards from '../cards';
import Player from '../player';
import State, { PHASE_ACTION, PHASE_BUY, PHASE_CLEANUP, PHASE_START, PHASE_TREASURE } from '../state';
import CostModifier from '../costModifier';
import BigMoney from '../../agents/dominiate/bigMoney';
import BMLibrary from '../../agents/dominiate/bmLibrary';

const basic2PlayerKingdom = {
  Curse: 10,
  Estate: 8,
  Duchy: 8,
  Province: 8,
  Copper: 46,
  Silver: 40,
  Gold: 30
};

const muteConfig = { log: () => {}, warn: () => {} };

/**
 *
 * @param {int} quantity
 * @returns {BasicAI[]}
 */
const createPlayers = (quantity = 2) => {
  const players = [];

  for (let i = 0; i < quantity; i++) {
    players.push(new BasicAI());
  }

  return players;
};

test('Setup returns the same instance', () => {
  const state = new State();
  const newState = state.setUp(createPlayers(2), muteConfig);

  expect(newState === state).toBe(true);
});

test('Cant create a game with less than 2 players', () => {
  const state = new State();

  expect(() => {
    state.setUp(createPlayers(1), muteConfig);
  }).toThrow();
});

test('Cant create a game with more than 6 players', () => {
  const state = new State();

  expect(() => {
    state.setUp(createPlayers(7), muteConfig);
  }).toThrow();
});

test('Empty kingdom on new instance', () => {
  const state = new State();

  expect(state.kingdom).toEqual({});
});

test('Default log is console', () => {
  const state = new State();

  state.setUp(createPlayers(2), {});
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

  state.setUp(createPlayers(2), muteConfig);
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

  state.setUp(createPlayers(2), muteConfig);
  expect(state.kingdom).toMatchObject(basic2PlayerKingdom);
});

test('Built kingdom has selected cards', () => {
  const state = new State();
  let kingdom;

  state.setUp(createPlayers(2), muteConfig);
  kingdom = state.buildKingdom([ cards.Village ]);
  expect(kingdom).toMatchObject({ Village: 10 });
});

test('Kingdom contains required cards', () => {
  const state = new State();
  const config = { required: [ 'Village' ], log: () => {} };

  state.setUp(createPlayers(2), config);
  expect(state.kingdom).toMatchObject({ Village: 10 });
});

test('Kingdom contains cards required by AI', () => {
  const state = new State();
  const players = createPlayers(2);

  players[0].requires = ['Village'];
  state.setUp(players, muteConfig);
  expect(state.kingdom).toMatchObject({ Village: 10 });
});

test('No empty piles at the start of the game', () => {
  const state = new State();
  const players = createPlayers(2);

  state.setUp(players, muteConfig);
  expect(state.emptyPiles()).toHaveLength(0);
});

test('emptyPiles returns the list of empty supply piles', () => {
  const state = new State();
  const players = createPlayers(2);
  let emptyPiles;

  state.setUp(players, muteConfig);
  state.kingdom.Curse = 0;
  state.kingdom.Estate = 0;
  emptyPiles = state.emptyPiles();

  expect(emptyPiles).toHaveLength(2);
  expect(emptyPiles).toContain('Curse');
  expect(emptyPiles).toContain('Estate');
});

test('Game is not over at the start of the game', () => {
  const state = new State();
  const players = createPlayers(2);

  state.setUp(players, muteConfig);

  expect(state.isGameOver()).toBe(false);
});

test('Game is over when provinces are depleted', () => {
  const state = new State();
  const players = createPlayers(2);

  state.setUp(players, muteConfig);
  state.kingdom.Province = 0;

  expect(state.isGameOver()).toBe(true);
});

test('Total piles to end game is 3 for 2-4 players', () => {
  const state = new State();

  for (let num = 2; num < 5; num++) {
    state.setUp(createPlayers(num), muteConfig);
    expect(state.totalPilesToEndGame()).toBe(3);
  }
});

test('Total piles to end game is 4 for 5-6 players', () => {
  const state = new State();

  for (let num = 5; num < 7; num++) {
    state.setUp(createPlayers(num), muteConfig);
    expect(state.totalPilesToEndGame()).toBe(4);
  }
});

test('Game is over when enough piles are depleted', () => {
  const state = new State();
  const players = createPlayers(2);

  state.setUp(players, muteConfig);
  state.totalPilesToEndGame = jest.fn(() => 1);
  state.kingdom.Estate = 0;

  expect(state.isGameOver()).toBe(true);
});

test('Game can only be over at the end of the turn', () => {
  const state = new State();
  const players = createPlayers(2);

  state.setUp(players, muteConfig);
  state.kingdom.Province = 0;
  state.phase = PHASE_BUY;

  expect(state.isGameOver()).toBe(false);
});

test('AllowDiscard returns empty array when allowing 0 cards', () => {
  const state = new State();
  const players = createPlayers(2);

  state.setUp(players, muteConfig);
  expect(state.allowDiscard(state.current, 0)).toHaveLength(0);
});

test('Default warn is console', () => {
  const state = new State();
  const originalLog = console.log;

  console.log = jest.fn();
  state.setUp(createPlayers(2), { log: () => {} });
  state.warn('A warning');
  expect(console.log).toHaveBeenCalledWith('WARN: A warning');
  console.log = originalLog;
});

test('Warn uses the configured function', () => {
  const state = new State();
  const players = createPlayers(2);
  const warnFunction = jest.fn(() => {});

  state.setUp(players, { warn: warnFunction, log: () => {} });
  state.warn('Warning message');
  expect(warnFunction).toHaveBeenCalledWith('Warning message');
});

test('doDiscard has no effect with wrong card', () => {
  const state = new State();
  const players = createPlayers(2);
  const card1 = new Card();
  const card2 = new Card();
  let result;

  state.setUp(players, muteConfig);
  state.current.hand.push(card1);
  state.current.discard = [];
  result = state.doDiscard(state.current, card2);

  expect(result).toBeNull();
  expect(state.current.hand.length).toBe(1);
  expect(state.current.discard.length).toBe(0);
});

test('doDiscard moves the card from the hand to the discard', () => {
  const state = new State();
  const players = createPlayers(2);
  const card1 = new Card();
  const card2 = new Card();
  const card3 = new Card();
  let result;

  state.setUp(players, muteConfig);
  card1.name = 'A Card';
  card2.name = 'Other Card';
  card3.name = 'Discard this Card';
  state.current.hand = [card1, card2, card3];
  state.current.discard = [];
  result = state.doDiscard(state.current, card3);

  expect(state.current.hand.length).toBe(2);
  expect(state.current.hand).not.toContain(card3);
  expect(state.current.discard.length).toBe(1);
  expect(state.current.discard).toContain(card3);
  expect(result).toBe(card3);
});

test('doDiscard with invalid origin does nothing', () => {
  const state = new State();
  const players = createPlayers(2);
  const card1 = new Card();
  let result;

  state.setUp(players, muteConfig);
  card1.name = 'A Card';
  state.current.hand = [card1];
  state.current.discard = [];
  result = state.doDiscard(state.current, card1, 'mordor');

  expect(state.current.hand).toHaveLength(1);
  expect(state.current.discard).not.toContain(card1);
  expect(state.current.discard).toHaveLength(0);
  expect(result).toBeNull();
});

test('doDiscard discards the card from other origins', () => {
  const state = new State();
  const players = createPlayers(2);
  const card1 = new Card();
  const card2 = new Card();
  const card3 = new Card();
  let result;

  state.setUp(players, muteConfig);
  card1.name = 'A Card';
  card2.name = 'Other Card';
  card3.name = 'Topdeck this Card';
  state.current.discard = [card1];
  state.current.draw = [card2, card3];
  result = state.doDiscard(state.current, card3, 'draw');

  expect(state.current.discard).toHaveLength(2);
  expect(state.current.draw).not.toContain(card3);
  expect(state.current.draw).toHaveLength(1);
  expect(state.current.discard[0]).toBe(card3);
  expect(result).toBe(card3);
});

test('doDiscard from deck discards from the top', () => {
  const state = new State();
  const players = createPlayers(2);
  const card1 = new Card();
  const card2 = new Card();
  let result;

  state.setUp(players, muteConfig);
  card2.name = 'Multiples';
  card1.name = 'Single';
  state.current.draw = [card1, card2, card2, card1]; // index 0 is top
  state.current.discard = [];
  result = state.doDiscard(state.current, card1, 'draw');

  expect(state.current.draw).toEqual([card2, card2, card1]);
  expect(result).toBe(card1);
});

test('doTrash has no effect with wrong card', () => {
  const state = new State();
  const players = createPlayers(2);
  const card1 = new Card();
  const card2 = new Card();

  state.setUp(players, muteConfig);
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

  state.setUp(players, muteConfig);
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

  state.setUp(players, muteConfig);
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

  state.setUp(players, muteConfig);
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

  state.setUp(players, muteConfig);
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

test('allowTrash returns empty array when allowing 0 cards', () => {
  const state = new State();
  const players = createPlayers(2);

  state.setUp(players, muteConfig);
  expect(state.allowTrash(state.current, 0)).toHaveLength(0);
});

test('allowTrash trashes whole hand if agent chooses', () => {
  const state = new State();
  const players = createPlayers(2);
  const card1 = new Card();
  const card2 = new Card();
  let trashed;

  state.setUp(players, muteConfig);
  state.current.agent.trashValue = card => card ? 1 : 0; // Prefer trash over null
  state.current.hand = [card1, card2];
  state.current.discard = [];
  trashed = state.allowTrash(state.current, 2);

  expect(trashed).toEqual([card1, card2]);
  expect(state.current.hand).toHaveLength(0);
  expect(state.trash).toHaveLength(2);
  expect(state.trash).toContain(card1);
  expect(state.trash).toContain(card2);
});

test('allowTrash has null as a valid choice', () => {
  const state = new State();
  const players = createPlayers(2);
  const card1 = new Card();

  state.setUp(players, muteConfig);
  state.current.hand.push(card1);
  state.current.agent.choose = jest.fn(state.current.agent.choose);
  state.current.agent.trashPriority = () => [ 'Worst Card', null, 'Best Card' ];
  state.allowTrash(state.current, 2);
  expect(state.current.agent.choose).toHaveBeenCalledWith('trash', state, expect.arrayContaining([ null ]));
});

test('allowTrash interrupts on null', () => {
  const state = new State();
  const players = createPlayers(2);
  const card1 = new Card();
  const card2 = new Card();
  let trashed;

  state.setUp(players, muteConfig);
  state.current.agent.trashPriority = () => [ 'Worst Card', null, 'Best Card' ];
  card1.name = 'Worst Card';
  state.current.hand.push(card1);
  card2.name = 'Best Card';
  state.current.hand.push(card2);
  state.current.discard = [];
  trashed = state.allowTrash(state.current, 2);

  expect(trashed).toEqual([card1]);
  expect(state.current.hand).toHaveLength(1);
  expect(state.trash).toHaveLength(1);
  expect(state.trash).toContain(card1);
});

test('doTopdeck has no effect with wrong card', () => {
  const state = new State();
  const players = createPlayers(2);
  const card1 = new Card();
  const card2 = new Card();

  state.setUp(players, muteConfig);
  state.current.hand.push(card1);
  state.current.draw = [];
  state.doTopdeck(state.current, card2);

  expect(state.current.hand).toHaveLength(1);
  expect(state.current.draw).toHaveLength(0);
});

test('doTopdeck moves the card from the hand to the top of deck', () => {
  const state = new State();
  const players = createPlayers(2);
  const card1 = new Card();
  const card2 = new Card();
  const card3 = new Card();

  state.setUp(players, muteConfig);
  card1.name = 'A Card';
  card2.name = 'Other Card';
  card3.name = 'Topdeck this Card';
  state.current.hand = [card2, card3];
  state.current.draw = [card1];
  state.doTopdeck(state.current, card3);

  expect(state.current.hand).toHaveLength(1);
  expect(state.current.hand).not.toContain(card3);
  expect(state.current.draw).toHaveLength(2);
  expect(state.current.draw[0]).toBe(card3);
});

test('doTopdeck with invalid origin does nothing', () => {
  const state = new State();
  const players = createPlayers(2);
  const card1 = new Card();

  state.setUp(players, muteConfig);
  card1.name = 'A Card';
  state.current.hand = [card1];
  state.current.draw = [];
  state.doTopdeck(state.current, card1, 'mordor');

  expect(state.current.hand).toHaveLength(1);
  expect(state.current.draw).not.toContain(card1);
  expect(state.current.draw).toHaveLength(0);
});

test('doTopdeck moves the card to the top of deck from other origins', () => {
  const state = new State();
  const players = createPlayers(2);
  const card1 = new Card();
  const card2 = new Card();
  const card3 = new Card();

  state.setUp(players, muteConfig);
  card1.name = 'A Card';
  card2.name = 'Other Card';
  card3.name = 'Topdeck this Card';
  state.current.discard = [card2, card3];
  state.current.draw = [card1];
  state.doTopdeck(state.current, card3, 'discard');

  expect(state.current.discard).toHaveLength(1);
  expect(state.current.discard).not.toContain(card3);
  expect(state.current.draw).toHaveLength(2);
  expect(state.current.draw[0]).toBe(card3);
});

test('playAction has no effect with wrong card', () => {
  const state = new State();
  const players = createPlayers(2);
  const card1 = new BasicAction();
  const card2 = new BasicAction();

  state.setUp(players, muteConfig);
  state.current.hand.push(card1);
  state.current.inPlay = [];
  state.playAction(card2);

  expect(state.current.hand).toHaveLength(1);
  expect(state.current.inPlay).toHaveLength(0);
});

test('playAction removes card from hand and puts it in play', () => {
  const state = new State();
  const card = new BasicAction();
  const basicAI = new BasicAI();

  state.setUp([basicAI, basicAI], muteConfig);
  state.current.hand = [card];
  state.current.inPlay = [];
  state.playAction(card);

  expect(state.current.hand).toHaveLength(0);
  expect(state.current.inPlay).toHaveLength(1);
});

test('playAction with invalid origin does nothing', () => {
  const state = new State();
  const players = createPlayers(2);
  const card = new BasicAction();

  state.setUp(players, muteConfig);
  state.current.hand = [card];
  state.current.inPlay = [];
  state.playAction(card, 'oz');

  expect(state.current.hand).toHaveLength(1);
  expect(state.current.inPlay).toHaveLength(0);
});

test('playAction puts the card in play from other origins', () => {
  const state = new State();
  const players = createPlayers(2);
  const card1 = new BasicAction();
  const card2 = new BasicAction();
  const card3 = new BasicAction();

  state.setUp(players, muteConfig);
  card1.name = 'An action';
  card2.name = 'Different action';
  card3.name = 'Play this action';
  state.current.discard = [card2, card3];
  state.current.hand = [card1];
  state.inPlay = [];
  state.playAction(card3, 'discard');

  expect(state.current.discard).toHaveLength(1);
  expect(state.current.discard).not.toContain(card3);
  expect(state.current.inPlay).toHaveLength(1);
  expect(state.current.inPlay).toContain(card3);
});

test('playAction resolves the card effects', () => {
  const card = new BasicAction();
  const state = new State();
  const basicAI = new BasicAI();

  state.setUp([basicAI, basicAI], muteConfig);
  state.current.hand = [card];
  state.resolveAction = jest.fn(() => {});
  state.playAction(card);

  expect(state.resolveAction).toHaveBeenCalledWith(card);
});

test('playTreasure removes card from hand and puts it in play', () => {
  const state = new State();
  const card = new Card();
  const basicAI = new BasicAI();

  card.types.push('Treasure');
  state.setUp([basicAI, basicAI], muteConfig);
  state.current.hand = [card];
  state.current.inPlay = [];
  state.playTreasure(card);

  expect(state.current.hand).toHaveLength(0);
  expect(state.current.inPlay).toHaveLength(1);
});

test('playTreasure has no effect with wrong card', () => {
  const state = new State();
  const players = createPlayers(2);
  const card1 = new Card();
  const card2 = new Card();

  card1.name = 'Card 1';
  card1.types.push('Treasure');
  card2.name = 'Card 2';
  card2.types.push('Treasure');
  state.setUp(players, muteConfig);
  state.current.hand = [card1];
  state.current.inPlay = [];
  state.playTreasure(card2);

  expect(state.current.hand).toHaveLength(1);
  expect(state.current.inPlay).toHaveLength(0);
});

test('playTreasure with invalid origin does nothing', () => {
  const state = new State();
  const players = createPlayers(2);
  const card = new Card();

  card.types.push('Treasure');
  state.setUp(players, muteConfig);
  state.current.hand = [card];
  state.current.inPlay = [];
  state.playTreasure(card, 'narnia');

  expect(state.current.hand).toHaveLength(1);
  expect(state.current.inPlay).toHaveLength(0);
});

test('playTreasure puts the card in play from other origins', () => {
  const state = new State();
  const players = createPlayers(2);
  const card1 = new Card();
  const card2 = new Card();
  const card3 = new Card();

  state.setUp(players, muteConfig);
  card1.name = 'A treasure';
  card1.types.push('Treasure');
  card2.name = 'Different treasure';
  card2.types.push('Treasure');
  card3.name = 'Play this treasure';
  card3.types.push('Treasure');
  state.current.discard = [card2, card3];
  state.current.hand = [card1];
  state.inPlay = [];
  state.playTreasure(card3, 'discard');

  expect(state.current.discard).toHaveLength(1);
  expect(state.current.discard).not.toContain(card3);
  expect(state.current.inPlay).toHaveLength(1);
  expect(state.current.inPlay).toContain(card3);
});

test('playAction triggers card onPlay', () => {
  const card = new BasicAction();
  const state = new State();
  const basicAI = new BasicAI();

  state.setUp([basicAI, basicAI], muteConfig);
  state.current.hand = [card];
  card.onPlay = jest.fn(() => {});
  state.playTreasure(card);

  expect(card.onPlay).toHaveBeenCalledWith(state);
});

test('gainOneOf calls for a gain choice in AI', () => {
  const state = new State();
  const players = createPlayers(2);
  const chooseMock = jest.fn(() => {});
  const card1 = new Card();
  const card2 = new Card();
  let choice;

  state.setUp(players, muteConfig);
  state.current.agent.choose = chooseMock;
  choice = state.gainOneOf(state.current, [card1, card2]);

  expect(chooseMock).toHaveBeenCalledWith('gain', state, [card1, card2]);
  expect(choice).not.toBeNull();
});

test('gainOneOf causes player to gain the card', () => {
  const state = new State();
  const players = createPlayers(2);
  const card1 = new Card();
  let choice;

  state.setUp(players, muteConfig);
  state.current.agent.choose = () => card1;
  state.gainCard = jest.fn(() => {});
  choice = state.gainOneOf(state.current, [card1]);

  expect(state.gainCard).toHaveBeenCalledWith(state.current, card1, 'discard');
  expect(choice).toBe(card1);
});

test('gainOneOf has no effect when choice is null', () => {
  const state = new State();
  const players = createPlayers(2);
  const card1 = new Card();
  let choice;

  state.setUp(players, muteConfig);
  state.current.agent.choose = () => null;
  state.gainCard = jest.fn(() => {});
  choice = state.gainOneOf(state.current, [card1, null]);

  expect(state.gainCard).not.toHaveBeenCalled();
  expect(choice).toBeNull();
});

test('gainCard adds the card to the player discard', () => {
  const state = new State();
  const players = createPlayers(2);
  const card1 = new Card();
  const card2 = new Card();

  card1.name = 'A Card';
  card2.name = 'Another Card';
  state.setUp(players, muteConfig);
  state.kingdom[card1] = 10;
  state.current.discard = [card2];
  state.gainCard(state.current, card1);

  expect(state.current.discard).toHaveLength(2);
  expect(state.current.discard[0]).toBe(card1);
});

test('gainCard lowers the pile', () => {
  const state = new State();
  const players = createPlayers(2);
  const card = new Card();

  state.setUp(players, muteConfig);
  state.kingdom[card] = 10;
  state.gainCard(state.current, card);

  expect(state.kingdom[card]).toBe(9);
});

test('gainCard does nothing when pile is empty', () => {
  const state = new State();
  const players = createPlayers(2);
  const card = new Card();

  state.setUp(players, muteConfig);
  state.kingdom[card] = 0;
  state.current.discard = [];
  state.gainCard(state.current, card);

  expect(state.current.discard).toHaveLength(0);
  expect(state.kingdom[card]).toBe(0);
});

test('countInSupply returns the number left from the kingdom', () => {
  const state = new State();
  const card = new Card();

  state.kingdom[card] = 5;
  expect(state.countInSupply(card)).toBe(5);
});

test('countInSupply returns 0 when the card is not in kingdom', () => {
  const state = new State();
  const card = new Card();

  expect(state.countInSupply(card)).toBe(0);
});

test('countInSupply returns the number left from the special pile', () => {
  const state = new State();
  const card = new Card();

  state.specialPiles[card] = 5;
  expect(state.countInSupply(card)).toBe(5);
});

test('gainCard from special pile', () => {
  const state = new State();
  const players = createPlayers(2);
  const card = new Card();

  state.setUp(players, muteConfig);
  state.specialPiles[card] = 10;
  state.current.discard = [];
  state.gainCard(state.current, card);

  expect(state.current.discard).toHaveLength(1);
  expect(state.current.discard[0]).toBe(card);
  expect(state.specialPiles[card]).toBe(9);
});

test('gainCard to different destination', () => {
  const state = new State();
  const players = createPlayers(2);
  const card1 = new Card();
  const card2 = new Card();

  card1.name = 'A Card';
  card2.name = 'Another Card';
  state.setUp(players, muteConfig);
  state.kingdom[card1] = 10;
  state.current.draw = [card2];
  state.current.discard = [];
  state.gainCard(state.current, card1, 'draw');

  expect(state.current.draw).toHaveLength(2);
  expect(state.current.draw[0]).toBe(card1);
  expect(state.current.discard).toHaveLength(0);
});

test('attackOpponents attacks each player', () => {
  const state = new State();
  const players = createPlayers();
  const effect = () => {};

  state.setUp(players, muteConfig);
  state.attackPlayer = jest.fn(() => {});
  state.attackOpponents(effect);

  expect(state.attackPlayer).toHaveBeenCalledTimes(1);
  expect(state.attackPlayer).toHaveBeenCalledWith(expect.any(Player), effect);
});

test('attackPlayer calls effect on player', () => {
  const state = new State();
  const effect = jest.fn(() => {});
  const players = createPlayers();

  state.setUp(players, muteConfig);
  state.attackPlayer(state.current, effect);

  expect(effect).toHaveBeenCalledWith(state.current, state);
});

test('attackPlayer calls for reaction cards in player hand', () => {
  const state = new State();
  const effect = jest.fn(() => {});
  const players = createPlayers();
  const reaction = new Card();
  const nonReaction = new Card();

  state.setUp(players, muteConfig);
  reaction.isReaction = () => true;
  reaction.reactToAttack = jest.fn(() => {});
  nonReaction.isReaction = () => false;
  nonReaction.reactToAttack = jest.fn(() => {});
  state.current.hand = [reaction, nonReaction];
  state.attackPlayer(state.current, effect);

  expect(reaction.reactToAttack).toHaveBeenCalled();
  expect(nonReaction.reactToAttack).not.toHaveBeenCalled();
});

test('attackPlayer has no effect when reaction blocks the attack', () => {
  const state = new State();
  const effect = jest.fn(() => {});
  const players = createPlayers();
  const reaction = new Card();

  state.setUp(players, muteConfig);
  reaction.isReaction = () => true;
  reaction.reactToAttack = jest.fn((state, player, attackEvent) => { attackEvent.blocked = true; });
  state.current.hand = [reaction];
  state.attackPlayer(state.current, effect);

  expect(effect).not.toHaveBeenCalled();
});

test('revealHand outputs player hand.', () => {
  const state = new State();
  const players = createPlayers();
  const logFn = jest.fn(() => {});
  const card = new Card();

  state.setUp(players, { log: logFn });
  card.name = 'A card';
  state.current.hand = [card];
  state.revealHand(state.current);

  expect(logFn).toHaveBeenCalledWith(expect.stringContaining('A card'));
});

test('doPhase increases the turn count and changes to action phase on start phase', () => {
  const state = new State();
  const players = createPlayers();

  state.setUp(players, muteConfig);
  state.phase = PHASE_START;
  state.current.turnsTaken = 2;
  state.doPhase();

  expect(state.current.turnsTaken).toBe(3);
  expect(state.phase).toBe(PHASE_ACTION);
});

test('doPhase triggers action phase and moves into treasure phase on action phase', () => {
  const state = new State();
  const players = createPlayers();

  state.setUp(players, muteConfig);
  state.phase = PHASE_ACTION;
  state.current.turnsTaken = 2;
  state.doActionPhase = jest.fn(() => {});
  state.doPhase();

  expect(state.current.turnsTaken).toBe(2);
  expect(state.doActionPhase).toHaveBeenCalled();
  expect(state.phase).toBe(PHASE_TREASURE);
});

test('doPhase triggers treasure phase and moves into buy phase on treasure phase', () => {
  const state = new State();
  const players = createPlayers();

  state.setUp(players, muteConfig);
  state.phase = PHASE_TREASURE;
  state.current.turnsTaken = 2;
  state.doTreasurePhase = jest.fn(() => {});
  state.doPhase();

  expect(state.current.turnsTaken).toBe(2);
  expect(state.doTreasurePhase).toHaveBeenCalled();
  expect(state.phase).toBe(PHASE_BUY);
});

test('doPhase triggers buy phase and moves into cleanup phase on buy phase', () => {
  const state = new State();
  const players = createPlayers();

  state.setUp(players, muteConfig);
  state.phase = PHASE_BUY;
  state.current.turnsTaken = 2;
  state.doBuyPhase = jest.fn(() => {});
  state.doPhase();

  expect(state.current.turnsTaken).toBe(2);
  expect(state.doBuyPhase).toHaveBeenCalled();
  expect(state.phase).toBe(PHASE_CLEANUP);
});

test('doPhase triggers cleanup phase, rotates players and moves into start phase on cleanup phase', () => {
  const state = new State();
  const players = createPlayers();

  state.setUp(players, muteConfig);
  state.phase = PHASE_CLEANUP;
  state.doCleanupPhase = jest.fn(() => {});
  state.rotatePlayer = jest.fn(() => {});
  state.doPhase();

  expect(state.doCleanupPhase).toHaveBeenCalled();
  expect(state.rotatePlayer).toHaveBeenCalled();
  expect(state.phase).toBe(PHASE_START);
});

test('doActionPhase calls for an action decision.', () => {
  const state = new State();
  const players = createPlayers();
  const action1 = new BasicAction();
  const action2 = new BasicAction();
  const nonaction = new Card();

  state.setUp(players, muteConfig);
  state.current.agent.choose = jest.fn(() => action1);
  state.current.hand = [action1, action2, nonaction];
  state.doActionPhase();

  expect(state.current.agent.choose).toHaveBeenCalledWith('play', state, expect.arrayContaining([action1, action2]));
  expect(state.current.agent.choose).toHaveBeenCalledWith('play', state, expect.not.arrayContaining([nonaction]));
});

test('doActionPhase plays the action card', () => {
  const state = new State();
  const players = createPlayers();
  const action1 = new BasicAction();

  state.setUp(players, muteConfig);
  state.playAction = jest.fn(() => {});
  state.current.hand = [action1];
  state.current.agent.choose = () => action1;
  state.doActionPhase();

  expect(state.playAction).toHaveBeenCalledWith(action1);
});

test('doActionPhase keeps playing actions while there are actions available', () => {
  const state = new State();
  const players = createPlayers();
  const action1 = new BasicAction();
  const action2 = new BasicAction();

  state.setUp(players, muteConfig);
  state.playAction = jest.fn(state.playAction);
  state.current.hand = [action1, action2];
  action1.name = 'Action 1';
  action2.name = 'Action 2';
  state.current.actions = 2;
  state.current.agent.playPriority = () => ['Action 1', 'Action 2'];
  state.doActionPhase();

  expect(state.playAction).toHaveBeenCalledTimes(2);
  expect(state.playAction).toHaveBeenCalledWith(action1);
  expect(state.playAction).toHaveBeenCalledWith(action2);
});

test('doActionPhase allows for the null choice', () => {
  const state = new State();
  const players = createPlayers();
  const action1 = new BasicAction();
  const action2 = new BasicAction();
  const nonaction = new Card();

  state.setUp(players, muteConfig);
  state.current.agent.choose = jest.fn(() => action1);
  state.current.hand = [action1, action2, nonaction];
  state.doActionPhase();

  expect(state.current.agent.choose).toHaveBeenCalledWith('play', state, expect.arrayContaining([null]));
});

test('doActionPhase stops playing actions when the agent chooses to', () => {
  const state = new State();
  const players = createPlayers();
  const action1 = new BasicAction();
  const action2 = new BasicAction();

  state.setUp(players, muteConfig);
  state.playAction = jest.fn(state.playAction);
  state.current.hand = [action1, action2];
  action1.name = 'Action 1';
  action2.name = 'Action 2';
  state.current.actions = 2;
  state.current.agent.playPriority = () => [null, 'Action 1', 'Action 2'];
  state.doActionPhase();

  expect(state.playAction).not.toHaveBeenCalled();
});

test('doTreasurePhase calls for a play decision with only treasures', () => {
  const state = new State();
  const players = createPlayers();
  const card1 = new Card();
  const card2 = new Card();

  state.setUp(players, muteConfig);
  card1.isTreasure = () => true;
  state.current.agent.choose = jest.fn(() => card1);
  state.current.hand = [card1, card2];
  state.doTreasurePhase();

  expect(state.current.agent.choose).toHaveBeenCalledWith('play', state, expect.arrayContaining([card1]));
  expect(state.current.agent.choose).toHaveBeenCalledWith('play', state, expect.not.arrayContaining([card2]));
});

test('doTreasurePhase plays the chosen treasures', () => {
  const state = new State();
  const players = createPlayers();
  const card = new Card();

  state.setUp(players, muteConfig);
  card.isTreasure = () => true;
  card.name = 'Card 2';
  state.playTreasure = jest.fn(state.playTreasure);
  state.current.agent.choose = jest.fn(() => card);
  state.current.hand = [card];
  state.doTreasurePhase();

  expect(state.playTreasure).toHaveBeenCalledWith(card);
});

test('doTreasurePhase does nothing with no treasures in hand', () => {
  const state = new State();
  const players = createPlayers();
  const card1 = new Card();
  const card2 = new Card();

  state.setUp(players, muteConfig);
  state.playTreasure = jest.fn(state.playTreasure);
  state.current.agent.choose = jest.fn(() => card1);
  state.current.hand = [card1, card2];
  state.doTreasurePhase();

  expect(state.current.agent.choose).not.toHaveBeenCalled();
  expect(state.playTreasure).not.toHaveBeenCalled();
});

test('doTreasurePhase plays multiple treasures if available', () => {
  const state = new State();
  const players = createPlayers();
  const card1 = new Card();
  const card2 = new Card();

  state.setUp(players, muteConfig);
  card1.isTreasure = () => true;
  card1.name = 'Card 1';
  card2.isTreasure = () => true;
  card2.name = 'Card 2';
  state.playTreasure = jest.fn(state.playTreasure);
  state.current.agent.playPriority = () => ['Card 1', 'Card 2'];
  state.current.hand = [card1, card2];
  state.doTreasurePhase();

  expect(state.playTreasure).toHaveBeenCalledWith(card1);
  expect(state.playTreasure).toHaveBeenCalledWith(card2);
});

test('doTreasurePhase allows for the null choice', () => {
  const state = new State();
  const players = createPlayers();
  const card1 = new Card();
  const card2 = new Card();

  state.setUp(players, muteConfig);
  card1.isTreasure = () => true;
  state.current.agent.choose = jest.fn(() => card1);
  state.current.hand = [card1, card2];
  state.doTreasurePhase();

  expect(state.current.agent.choose).toHaveBeenCalledWith('play', state, expect.arrayContaining([null]));
});

test('doTreasurePhase stops playing treasures when agent chooses to', () => {
  const state = new State();
  const players = createPlayers();
  const card = new Card();

  state.setUp(players, muteConfig);
  card.isTreasure = () => true;
  card.name = 'Card 2';
  state.playTreasure = jest.fn(state.playTreasure);
  state.current.agent.choose = jest.fn(() => null);
  state.current.hand = [card];
  state.doTreasurePhase();

  expect(state.playTreasure).not.toHaveBeenCalledWith(card);
});

test('resolveAction updates history and triggers card onPlay', () => {
  const state = new State();
  const action = new BasicAction();

  state.setUp(createPlayers(), muteConfig);
  action.onPlay = jest.fn(() => {});
  state.resolveAction(action);

  expect(state.current.cardsPlayed).toContain(action);
  expect(action.onPlay).toHaveBeenCalledWith(state);
});

test('doBuyPhase calls for a gain choice', () => {
  const state = new State();
  const players = createPlayers();

  state.setUp(players, muteConfig);
  state.getSingleBuyDecision = jest.fn(() => cards.Copper);
  state.doBuyPhase();

  expect(state.getSingleBuyDecision).toHaveBeenCalled();
});

test('doBuyPhase causes player to gain chosen card and spend resources', () => {
  const state = new State();
  const players = createPlayers();

  state.setUp(players, muteConfig);
  state.current.coins = 2;
  state.current.buys = 1;
  state.getSingleBuyDecision = jest.fn(() => cards.Estate);
  state.gainCard = jest.fn(() => {});
  state.doBuyPhase();

  expect(state.gainCard).toHaveBeenCalledWith(state.current, cards.Estate);
  expect(state.current.coins).toBe(0);
  expect(state.current.buys).toBe(0);
});

test('doBuyPhase buys multiple cards with multiple buys and enough money', () => {
  const state = new State();
  const players = createPlayers();

  state.setUp(players, muteConfig);
  state.current.coins = 4;
  state.current.buys = 2;
  state.getSingleBuyDecision = jest.fn(() => cards.Estate);
  state.gainCard = jest.fn(() => {});
  state.doBuyPhase();

  expect(state.gainCard).toHaveBeenCalledTimes(2);
  expect(state.gainCard).toHaveBeenCalledWith(state.current, cards.Estate);
  expect(state.current.coins).toBe(0);
  expect(state.current.buys).toBe(0);
});

test('doBuyPhase stops buying cards if the agent chooses to', () => {
  const state = new State();
  const players = createPlayers();

  state.setUp(players, muteConfig);
  state.current.coins = 4;
  state.current.buys = 2;
  state.getSingleBuyDecision = jest.fn(() => null);
  state.gainCard = jest.fn(() => {});
  state.doBuyPhase();

  expect(state.gainCard).not.toHaveBeenCalled();
  expect(state.current.coins).toBe(4);
  expect(state.current.buys).toBe(2);
});

test('gainsToEndGame is the sum of the lowest piles when piles are low', () => {
  const state = new State();

  state.kingdom.Estate = 1;
  state.kingdom.Duchy = 2;
  state.kingdom.Province = 8;
  state.kingdom.Curse = 0;
  state.totalPilesToEndGame = jest.fn(() => 3);

  expect(state.gainsToEndGame()).toBe(3);
  expect(state.totalPilesToEndGame).toHaveBeenCalled();
});

test('gainsToEndGame returns Province count when it is low', () => {
  const state = new State();

  state.kingdom.Estate = 1;
  state.kingdom.Duchy = 2;
  state.kingdom.Province = 2;
  state.kingdom.Curse = 0;

  expect(state.gainsToEndGame()).toBe(2);
});

test('gainsToEndGame returns value from cache if available', () => {
  const state = new State();

  state.totalPilesToEndGame = jest.fn(() => 3);
  state.kingdom.Estate = 1;
  state.kingdom.Duchy = 2;
  state.kingdom.Province = 2;
  state.kingdom.Curse = 0;
  state.cache.gainsToEndGame = 2;

  expect(state.gainsToEndGame()).toBe(2);
  expect(state.totalPilesToEndGame).not.toHaveBeenCalled();
});

test('gainsToEndGame updates cache', () => {
  const state = new State();

  state.kingdom.Estate = 1;
  state.kingdom.Duchy = 2;
  state.kingdom.Province = 2;
  state.kingdom.Curse = 0;

  expect(state.gainsToEndGame()).toBe(2);
  expect(state.cache.gainsToEndGame).toBe(2);
});

test('getSingleBuyDecision calls for a gain choice with the cards the player can afford', () => {
  const state = new State();

  state.setUp(createPlayers(), muteConfig);
  state.kingdom = {
    Copper: 10,
    Silver: 10,
    Curse: 0,
    Estate: 8,
    Duchy: 8
  };

  state.current.coins = 2;
  state.current.agent.choose = jest.fn(state.current.agent.choose);
  state.getSingleBuyDecision();
  expect(state.current.agent.choose).toHaveBeenCalledWith('gain', state, expect.arrayContaining([cards.Copper, cards.Estate]));
  expect(state.current.agent.choose).toHaveBeenCalledWith('gain', state, expect.not.arrayContaining([cards.Curse]));
});

test('getSingleBuyDecision allows for the null choice', () => {
  const state = new State();

  state.setUp(createPlayers(), muteConfig);
  state.kingdom = {
    Copper: 10,
    Silver: 10,
    Curse: 0,
    Estate: 8,
    Duchy: 8
  };

  state.current.coins = 2;
  state.current.agent.choose = jest.fn(state.current.agent.choose);
  state.getSingleBuyDecision();
  expect(state.current.agent.choose).toHaveBeenCalledWith('gain', state, expect.arrayContaining([null]));
});

test('doCleanupPhase cleans cards in play and hand', () => {
  const state = new State();
  const card1 = new Card();
  const card2 = new Card();

  state.setUp(createPlayers(), muteConfig);
  state.kingdom.Curse = 2; // Lower Curse pile by 8 for the 8 cards simulated below
  state.current.inPlay = [card1];
  state.current.hand = [card2];
  state.current.draw = [card1, card1, card1, card1, card1, card1];
  state.doCleanupPhase();

  expect(state.current.inPlay).toHaveLength(0);
  expect(state.current.hand).toHaveLength(5);
  expect(state.current.discard).toContain(card1);
  expect(state.current.discard).toContain(card2);
});

test('doCleanupPhase resets player status', () => {
  const state = new State();

  state.setUp(createPlayers(), muteConfig);
  state.current.actions = 0;
  state.current.buys = 0;
  state.current.coins = 2;
  state.current.cardsPlayed = [new Card()];
  state.doCleanupPhase();

  expect(state.current.actions).toBe(1);
  expect(state.current.buys).toBe(1);
  expect(state.current.coins).toBe(0);
  expect(state.current.cardsPlayed).toHaveLength(0);
});

test('doCleanupPhase throws an error when cards banished', () => {
  const state = new State();

  state.setUp(createPlayers(), muteConfig);
  state.totalCards = 100;
  state.countTotalCards = jest.fn(() => 50);

  expect(() => {
    state.doCleanupPhase();
  }).toThrow();
});

test('countTotalCards counts supply + players decks + trash', () => {
  const state = new State();

  state.setUp(createPlayers(), muteConfig);
  state.kingdom = {
    'Copper': 60,
    'Curse': 10
  };

  state.players[0].numCardsInDeck = jest.fn(() => 10);
  state.players[1].numCardsInDeck = jest.fn(() => 20);
  state.trash = [new Card()];
  expect(state.countTotalCards()).toBe(101);
});

test('rotatePLayer shifts player order and updates current player', () => {
  const state = new State();
  let player1, player2;

  state.setUp(createPlayers(), muteConfig);
  state.phase = PHASE_CLEANUP;
  player1 = state.players[0];
  player2 = state.players[1];
  state.rotatePlayer();

  expect(state.current).toBe(player2);
  expect(state.players).toEqual([player2, player1]);
  expect(state.phase).toBe(PHASE_START);
});

test('requireDiscard returns empty array when requiring 0 cards', () => {
  const state = new State();
  const players = createPlayers(2);

  state.setUp(players, muteConfig);
  expect(state.requireDiscard(state.current, 0)).toHaveLength(0);
});

test('requireDiscard discards the required number of cards chosen by the agent', () => {
  const state = new State();
  const players = createPlayers(2);
  const card1 = new Card();
  const card2 = new Card();
  let discarded;

  state.setUp(players, muteConfig);
  state.current.agent.choose = jest.fn(state.current.agent.choose);
  state.current.agent.discardValue = card => card === card1 ? 1 : 0; // Only discard card1
  state.current.hand = [card1, card2, card1, card1, card2];
  state.current.discard = [];
  discarded = state.requireDiscard(state.current, 2);

  expect(state.current.agent.choose).toHaveBeenCalledTimes(2);
  expect(discarded).toEqual([card1, card1]);
  expect(state.current.hand.length).toBe(3);
  expect(state.current.discard.length).toBe(2);
  expect(state.current.discard).toContainEqual(card1);
});

test('requireDiscard discards the whole hand if player does not have enough', () => {
  const state = new State();
  const players = createPlayers(2);
  const card1 = new Card();
  const card2 = new Card();
  let discarded;

  state.setUp(players, muteConfig);
  state.current.agent.choose = jest.fn(state.current.agent.choose);
  state.current.hand = [card1, card2];
  state.current.discard = [];
  discarded = state.requireDiscard(state.current, 3);

  expect(state.current.agent.choose).toHaveBeenCalledTimes(2);
  expect(discarded).toEqual([card1, card2]);
  expect(state.current.hand.length).toBe(0);
  expect(state.current.discard.length).toBe(2);
  expect(state.current.discard).toEqual([card1, card2]);
});

test('Kingdom has the correct amount of cards', () => {
  const state = new State();
  const players = createPlayers(2);

  players[0].requires = [ cards.Smithy, cards.Village ];
  players[1].requires = [ cards.Smithy, cards.Festival ];
  state.setUp(players, muteConfig);

  // Curses + 3 Victory Piles + 3 Treasure Piles + 10 Kingdom Piles = 17
  expect(Object.keys(state.kingdom).length).toBeGreaterThanOrEqual(17);
});

test('Copy creates an State object', () => {
  const state = new State();

  expect(state.copy()).toBeInstanceOf(State);
});

test('Copied state has same stuff', () => {
  const state = new State();
  let newState;

  state.setUp(createPlayers(2), muteConfig);
  state.trash.push(cards.Copper);
  state.phase = PHASE_BUY;
  state.costModifiers = [
    new CostModifier(() => {}, cards.Bridge)
  ];

  newState = state.copy();

  expect(newState.kingdom).toEqual(state.kingdom);
  expect(newState.kingdom).not.toBe(state.kingdom);
  expect(newState.log).toBe(state.log);
  expect(newState.trash).toEqual(state.trash);
  expect(newState.trash).not.toBe(state.trash);
  expect(newState.phase).toEqual(state.phase);
  expect(newState.cache).toEqual({});
  expect(newState.costModifiers).toEqual(state.costModifiers);
});

test('Copied state has new players', () => {
  const state = new State();
  let newState;

  state.setUp(createPlayers(2), muteConfig);
  newState = state.copy();

  expect(newState.current).not.toBe(state.current);
  expect(newState.current.agent).toBe(state.current.agent);
});

test('Cleanup clears costModifiers', () => {
  const state = new State();
  const card = new Card();

  state.setUp(createPlayers(), muteConfig);
  state.costModifiers = [new CostModifier(() => {}, card)];
  state.doCleanupPhase();

  expect(state.costModifiers).toHaveLength(0);
});

test('Hypothetical game state returns a new game state and a player state', () => {
  const state = new State();
  const basicAI = new BasicAI();
  const agents = [
    basicAI,
    new BigMoney()
  ];

  state.setUp(agents, muteConfig);
  const player = basicAI.myPlayer(state);

  const [ newState, newPlayer ] = state.hypothetical(basicAI);

  expect(newState).toBeInstanceOf(State);
  expect(newState).not.toBe(state);
  expect(newState.depth).toBe(1);
  expect(newPlayer).toBeInstanceOf(Player);
  expect(newPlayer).not.toBe(player);
  expect(newPlayer.agent).toBe(basicAI);
});

test('Hypothetical game state throws an exception if can \'t find agent', () => {
  const state = new State();
  const basicAI = new BasicAI();
  const agents = [
    new BMLibrary(),
    new BigMoney()
  ];

  state.setUp(agents, muteConfig);

  const test = () => {
    state.hypothetical(basicAI);
  };

  expect(test).toThrow(Error);
  expect(test).toThrow('Can\'t find this agent in the player list');
});


test('Hypothetical game state rotates players to make agent the current player', () => {
  const state = new State();
  const basicAI = new BasicAI();
  const bigMoney = new BigMoney();
  const agents = [ basicAI, bigMoney ];

  state.setUp(agents, muteConfig);

  const opponent = state.players.find(p => p.agent === bigMoney);
  opponent.hand = [ cards.Copper, cards.Estate, cards.Silver ];
  opponent.draw = [
    cards.Gold, cards.Duchy, cards.Province, cards.Curse
  ];

  const player = state.players.find(p => p.agent === basicAI);
  player.draw = [
    cards.Copper, cards.Estate, cards.Silver, cards.Gold, cards.Duchy,
    cards.Province, cards.Curse
  ];

  // Force the opponent (big money) to be p0 and the player (basic ai) to be p1
  state.players = [ opponent, player ];

  const [ newState ] = state.hypothetical(basicAI);

  expect(newState.players[0].agent).toBeInstanceOf(BasicAI);
  expect(newState.players[1].agent).toBeInstanceOf(BigMoney);
});

test('Hypothetical game state randomizes the hidden information', () => {
  const state = new State();
  const basicAI = new BasicAI();
  const bigMoney = new BigMoney();
  const agents = [ basicAI, bigMoney ];

  state.setUp(agents, muteConfig);

  const opponent = state.players.find(p => p.agent === bigMoney);
  opponent.hand = [ cards.Copper, cards.Estate, cards.Silver ];
  opponent.draw = [
    cards.Gold, cards.Duchy, cards.Province, cards.Curse
  ];

  const player = state.players.find(p => p.agent === basicAI);
  player.draw = [
    cards.Copper, cards.Estate, cards.Silver, cards.Gold, cards.Duchy,
    cards.Province, cards.Curse
  ];

  const [ newState ] = state.hypothetical(basicAI);

  expect(newState.players[1].hand).not.toEqual(opponent.hand);
  expect(newState.players[1].hand.length).toEqual(opponent.hand.length);
  expect(newState.players[1].draw).not.toEqual(opponent.draw);
  expect(newState.players[1].draw.length).toEqual(opponent.draw.length);
  expect(newState.players[0].draw).not.toEqual(player.draw);
  expect(newState.players[0].draw.length).toEqual(player.draw.length);
});
