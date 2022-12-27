import CouncilRoomMilitiaMiningVillage from '../councilRoomMilitiaMiningVillage.js';
import State from '../../../game/state.js';
import cards from '../../../game/cards.js';

const muteConfig = { log: () => {} };

test('gainPriority at game start', () => {
  const agent = new CouncilRoomMilitiaMiningVillage();
  const state = new State();

  state.setUp([agent, agent], muteConfig);

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [
      cards['Council Room'],
      cards.Militia,
      cards['Mining Village']
    ]
  );
});

test('Wants Province with 13 coins', () => {
  const agent = new CouncilRoomMilitiaMiningVillage();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  // $13
  state.current.hand = [cards.Gold, cards.Gold, cards.Gold];
  state.current.coins = 4;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [
      cards.Province,
      cards['Council Room'],
      cards.Militia,
      cards['Mining Village']
    ]
  );
});

test('Wants Province after 1st Province', () => {
  const agent = new CouncilRoomMilitiaMiningVillage();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.current.discard.push(cards.Province);

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [
      cards.Province,
      cards['Council Room'],
      cards.Militia,
      cards['Mining Village']
    ]
  );
});

test('Duchy dancing', () => {
  const agent = new CouncilRoomMilitiaMiningVillage();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.kingdom[cards.Province] = 4;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [
      cards.Duchy,
      cards['Council Room'],
      cards.Militia,
      cards['Mining Village']
    ]
  );
});

test('Endgame Estates', () => {
  const agent = new CouncilRoomMilitiaMiningVillage();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.kingdom[cards.Province] = 2;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [
      cards.Duchy,
      cards.Estate,
      cards['Council Room'],
      cards.Militia,
      cards['Mining Village']
    ]
  );
});

test('More riches after Council Room!', () => {
  const agent = new CouncilRoomMilitiaMiningVillage();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.current.discard.push(cards['Council Room'], cards['Council Room']);

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [
      cards.Gold,
      cards.Militia,
      cards['Mining Village']
    ]
  );
});

test('Enough riches', () => {
  const agent = new CouncilRoomMilitiaMiningVillage();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.current.discard.push(
    cards['Council Room'],
    cards['Council Room'],
    cards['Council Room'],
    cards['Council Room'],
    cards['Council Room'],
    cards.Gold,
    cards.Gold,
    cards.Gold
    // $16
  );

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [
      cards.Militia,
      cards['Mining Village']
    ]
  );
});

test('More draw', () => {
  const agent = new CouncilRoomMilitiaMiningVillage();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.current.discard.push(
    cards['Mining Village'],
    cards['Mining Village']
  );

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [
      cards['Council Room'],
      cards['Council Room'],
      cards.Militia,
      cards['Mining Village']
    ]
  );
});
