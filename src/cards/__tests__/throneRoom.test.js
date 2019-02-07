import BasicAI from '../../agents/basicAI';
import State from '../../game/state';
import BasicAction from '../basicAction';
import Card from '../card';
import ThroneRoom from '../throneRoom';

test('Throne Room card defnition', () => {
  const card = new ThroneRoom();

  expect(card.toString()).toBe('Throne Room');
  expect(card.cost).toBe(4);
});

test('playEffect calls for a play choice with the actions in hand', () => {
  const state = new State();
  const card = new ThroneRoom();
  const action1 = new BasicAction();
  const action2 = new BasicAction();
  const nonaction = new Card();

  state.setUp([new BasicAI(), new BasicAI()]);
  state.current.hand = [action1, action2, nonaction];
  state.current.agent.choose = jest.fn(() => {});
  card.playEffect(state);

  expect(state.current.agent.choose).toHaveBeenCalledWith(BasicAI.CHOICE_PLAY, state, expect.arrayContaining([action1, action2, null]));
});

test('playEffect does not call for a choice with no actions in hand', () => {
  const state = new State();
  const card = new ThroneRoom();
  const nonaction = new Card();

  state.setUp([new BasicAI(), new BasicAI()]);
  state.current.hand = [nonaction];
  state.current.agent.choose = jest.fn(() => {});
  card.playEffect(state);

  expect(state.current.agent.choose).not.toHaveBeenCalled();
});

test('playEffect plays the chosen action twice', () => {
  const state = new State();
  const card = new ThroneRoom();
  const action1 = new BasicAction();

  state.setUp([new BasicAI(), new BasicAI()]);
  state.current.hand = [action1];
  state.current.agent.choose = () => action1;
  state.playAction = jest.fn(() => {});
  state.resolveAction = jest.fn(() => {});
  card.playEffect(state);

  expect(state.playAction).toHaveBeenCalledWith(action1);
  expect(state.resolveAction).toHaveBeenCalledWith(action1);
});

test('playEffect does nothing the the player chooses null', () => {
  const state = new State();
  const card = new ThroneRoom();
  const action1 = new BasicAction();

  state.setUp([new BasicAI(), new BasicAI()]);
  state.current.hand = [action1];
  state.current.agent.choose = () => null;
  state.playAction = jest.fn(() => {});
  state.resolveAction = jest.fn(() => {});
  card.playEffect(state);

  expect(state.playAction).not.toHaveBeenCalled();
  expect(state.resolveAction).not.toHaveBeenCalled();
});
