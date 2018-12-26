import BasicAI from '../../agents/basicAI';
import BasicAction from '../../cards/basicAction';
import Card from '../../cards/card';
import Player from '../player';
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

const muteConfig = { log: () => {}, warn: () => {} };

/**
 *
 * @param {int} quantiy
 * @returns {BasicAI[]}
 */
const createPlayers = (quantiy = 2) => {
  const players = [];

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
  expect(state.allowDiscard(state.current, 0)).toHaveLength(0);
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
  card2.name = 'Mutiples';
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

  state.setUp(players);
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

test('playAction triggers card playEffect', () => {
  const card = new BasicAction();
  const state = new State();
  const basicAI = new BasicAI();

  state.setUp([basicAI, basicAI], muteConfig);
  state.current.hand = [card];
  card.playEffect = jest.fn(() => {});
  state.playAction(card);

  expect(card.playEffect).toHaveBeenCalledWith(state);
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
