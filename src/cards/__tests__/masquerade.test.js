import BasicAI, { CHOICE_TRASH } from '../../agents/basicAI';
import State from '../../game/state';
import Card from '../card';
import Masquerade from '../masquerade';

const muteConfig = { log: () => {}, warn: () => {} };

test('Masquerade card definition', () => {
  const card = new Masquerade();

  expect(card.toString()).toBe('Masquerade');
  expect(card.cost).toBe(3);
  expect(card.cards).toBe(2);
  expect(card.isAction()).toBeTruthy();
});

test('playEffect asks each player with cards to choose with CHOICE_TRASH', () => {
  const state = new State();
  const card = new Masquerade();
  const card1 = new Card();
  const card2 = new Card();

  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  const [player1, player2] = state.players;

  player1.hand = [card1];
  player2.hand = [card2];
  player1.agent.choose = jest.fn(() => card1);
  player2.agent.choose = jest.fn(() => card2);
  state.allowTrash = jest.fn();

  card.playEffect(state);

  expect(player1.agent.choose).toHaveBeenCalledWith(CHOICE_TRASH, state, [card1]);
  expect(player2.agent.choose).toHaveBeenCalledWith(CHOICE_TRASH, state, [card2]);
});

test('playEffect passes cards circularly to next player', () => {
  const state = new State();
  const card = new Masquerade();
  const card1 = new Card();
  const card2 = new Card();

  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  const [player1, player2] = state.players;

  player1.hand = [card1];
  player2.hand = [card2];
  player1.agent.choose = jest.fn(() => card1);
  player2.agent.choose = jest.fn(() => card2);
  state.allowTrash = jest.fn();

  card.playEffect(state);

  expect(player1.hand).toContain(card2);
  expect(player1.hand).not.toContain(card1);
  expect(player2.hand).toContain(card1);
  expect(player2.hand).not.toContain(card2);
});

test('playEffect skips players with empty hands', () => {
  const state = new State();
  const card = new Masquerade();
  const card1 = new Card();
  const card3 = new Card();

  state.setUp([new BasicAI(), new BasicAI(), new BasicAI()], muteConfig);
  const [player1, player2, player3] = state.players;

  player1.hand = [card1];
  player2.hand = [];
  player3.hand = [card3];
  player1.agent.choose = jest.fn(() => card1);
  player2.agent.choose = jest.fn();
  player3.agent.choose = jest.fn(() => card3);
  state.allowTrash = jest.fn();

  card.playEffect(state);

  // player2 is skipped; player1 passes to player3, player3 wraps back to player1
  expect(player2.agent.choose).not.toHaveBeenCalledWith(CHOICE_TRASH, state, expect.any(Array));
  expect(player1.hand).toContain(card3);
  expect(player1.hand).not.toContain(card1);
  expect(player3.hand).toContain(card1);
  expect(player3.hand).not.toContain(card3);
});

test('playEffect collects choices simultaneously before moving cards', () => {
  const state = new State();
  const card = new Masquerade();
  const card1 = new Card();
  const card2 = new Card();

  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  const [player1, player2] = state.players;

  player1.hand = [card1];
  player2.hand = [card2];

  // Each agent is offered only their own original hand (simultaneous collection)
  player1.agent.choose = jest.fn((type, st, choices) => choices[0]);
  player2.agent.choose = jest.fn((type, st, choices) => choices[0]);
  state.allowTrash = jest.fn();

  card.playEffect(state);

  // player2 was offered [card2] before card1 arrived, not [card1, card2]
  expect(player2.agent.choose).toHaveBeenCalledWith(CHOICE_TRASH, state, [card2]);
});

test('playEffect allows current player to trash after passing', () => {
  const state = new State();
  const card = new Masquerade();

  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  state.players[0].hand = [];
  state.players[1].hand = [];
  state.allowTrash = jest.fn();

  card.playEffect(state);

  expect(state.allowTrash).toHaveBeenCalledWith(state.current, 1);
});

test('playEffect does not ask players with empty hands to choose', () => {
  const state = new State();
  const card = new Masquerade();

  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  state.players[0].hand = [];
  state.players[1].hand = [];
  state.players[0].agent.choose = jest.fn();
  state.players[1].agent.choose = jest.fn();
  state.allowTrash = jest.fn();

  card.playEffect(state);

  expect(state.players[0].agent.choose).not.toHaveBeenCalledWith(CHOICE_TRASH, state, expect.any(Array));
  expect(state.players[1].agent.choose).not.toHaveBeenCalledWith(CHOICE_TRASH, state, expect.any(Array));
});
