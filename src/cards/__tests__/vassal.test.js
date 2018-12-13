import BasicAI from '../../agents/basicAI';
import State from '../../game/state';
import BasicAction from '../basicAction';
import Silver from '../silver';
import Vassal from '../vassal';

test('Vassal card definition', () => {
  const card = new Vassal();

  expect(card.cost).toBe(3);
  expect(card.coins).toBe(2);
});

test('Vassal has no effect on an empty deck', () => {
  const card = new Vassal();
  const basicAI = new BasicAI();
  const state = new State();

  state.setUp([basicAI, basicAI], { log: () => {}, warn: () => {} });
  state.current.draw = [];
  state.current.discard = [];
  basicAI.choose = jest.fn(basicAI.choose);
  card.playEffect(state);

  expect(state.current.draw).toHaveLength(0);
  expect(state.current.discard).toHaveLength(0);
  expect(basicAI.choose).not.toHaveBeenCalled();
});

test('Vassal discards top non-action and does not ast for decision', () => {
  const card = new Vassal();
  const basicAI = new BasicAI();
  const state = new State();
  const silver = new Silver();

  state.setUp([basicAI, basicAI], { log: () => {}, warn: () => {} });
  state.current.draw = [silver];
  state.current.discard = [];
  basicAI.choose = jest.fn(basicAI.choose);
  card.playEffect(state);

  expect(state.current.draw).toHaveLength(0);
  expect(state.current.discard).toHaveLength(1);
  expect(basicAI.choose).not.toHaveBeenCalled();
});

test('Vassal discards top action and asks for decision if it is an action', () => {
  const card = new Vassal();
  const basicAI = new BasicAI();
  const state = new State();
  const action = new BasicAction();

  state.setUp([basicAI, basicAI], { log: () => {}, warn: () => {} });
  state.current.draw = [action];
  state.current.discard = [];
  basicAI.choose = jest.fn(() => action);
  card.playEffect(state);

  expect(state.current.draw).toHaveLength(0);
  expect(basicAI.choose).toHaveBeenCalledWith('play', state, expect.arrayContaining([action]));
});

test('Vassal plays top action card if the agent chooses to', () => {
  const card = new Vassal();
  const basicAI = new BasicAI();
  const state = new State();
  const action = new BasicAction();

  action.name = 'A card';
  state.setUp([basicAI, basicAI], { log: () => {}, warn: () => {} });
  state.current.draw = [action];
  state.current.discard = [];
  basicAI.playPriority = () => ['A card'];
  state.playAction = jest.fn(state.playAction);
  card.playEffect(state);

  expect(state.current.draw).toHaveLength(0);
  expect(state.current.discard).toHaveLength(0);
  expect(state.current.inPlay).toHaveLength(1);
  expect(state.playAction).toHaveBeenCalledWith(action, 'discard');
});

test('Vassal allows for null choice when top card is action', () => {
  const card = new Vassal();
  const basicAI = new BasicAI();
  const state = new State();
  const action = new BasicAction();

  state.setUp([basicAI, basicAI], { log: () => {}, warn: () => {} });
  state.current.draw = [action];
  state.current.discard = [];
  basicAI.choose = jest.fn(() => action);
  card.playEffect(state);

  expect(basicAI.choose).toHaveBeenCalledWith('play', state, expect.arrayContaining([null]));
});

test('Vassal does not play the action if the agent chooses not to', () => {
  const card = new Vassal();
  const basicAI = new BasicAI();
  const state = new State();
  const action = new BasicAction();

  state.setUp([basicAI, basicAI], { log: () => {}, warn: () => {} });
  state.current.draw = [action];
  state.current.discard = [];
  basicAI.choose = jest.fn(() => null);
  state.playAction = jest.fn(state.playAction);
  card.playEffect(state);

  expect(state.playAction).not.toHaveBeenCalled();
});
