import MiningVillage from '../miningVillage.js';
import State from '../../game/state.js';
import BasicAI from '../../agents/basicAI.js';
import { LOCATION_IN_PLAY, LOCATION_TRASH } from '../../game/player.js';

const muteConfig = { log: () => {}, warn: () => {} };

test('Mining Village card definition', () => {
  const card = new MiningVillage();

  expect(card.toString()).toBe('Mining Village');
  expect(card.cost).toBe(4);
  expect(card.actions).toBe(2);
  expect(card.cards).toBe(1);
});

test('Trash after play gains coins', () => {
  const card = new MiningVillage();
  const state = new State();

  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  state.trash = [];
  state.current.coins = 0;
  state.current.inPlay = [ card ];
  state.current.playLocation = LOCATION_IN_PLAY;
  state.current.agent.wantsToTrashMiningVillage = () => true;

  card.playEffect(state);

  expect(state.current.coins).toBe(2);
  expect(state.current.playLocation).toBe(LOCATION_TRASH);
  expect(state.current.inPlay).not.toContain(card);
  expect(state.trash).toContain(card);
});

test('Don\'t trash when player doesn\'t want to', () => {
  const card = new MiningVillage();
  const state = new State();

  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  state.trash = [];
  state.current.coins = 0;
  state.current.inPlay = [ card ];
  state.current.playLocation = LOCATION_IN_PLAY;
  state.current.agent.wantsToTrashMiningVillage = () => false;

  card.playEffect(state);

  expect(state.current.coins).toBe(0);
  expect(state.current.playLocation).toBe(LOCATION_IN_PLAY);
  expect(state.current.inPlay).toContain(card);
  expect(state.trash).not.toContain(card);
});

test('Can\'t trash if card is not in play', () => {
  const card = new MiningVillage();
  const state = new State();

  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  state.trash = [ card ];
  state.current.coins = 0;
  state.current.inPlay = [];
  state.current.playLocation = LOCATION_TRASH;
  state.current.agent.wantsToTrashMiningVillage = () => true;

  card.playEffect(state);

  expect(state.current.coins).toBe(0);
  expect(state.current.playLocation).toBe(LOCATION_TRASH);
  expect(state.current.inPlay).not.toContain(card);
  expect(state.trash).toContain(card);
});
