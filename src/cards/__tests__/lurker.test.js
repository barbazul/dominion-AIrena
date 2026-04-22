import cards from '../../game/cards.js';
import Lurker, { LURKER_GAIN, LURKER_TRASH } from '../lurker.js';
import State from '../../game/state.js';
import BasicAI from '../../agents/basicAI.js';

const muteConfig = { log: () => {}, warn: () => {} };

test('Lurker card definition', () => {
  const card = new Lurker();

  expect(card.toString()).toBe('Lurker');
  expect(card.cost).toBe(2);
  expect(card.actions).toBe(1);
  expect(card.isAction()).toBe(true);
});

test('Lurker presents Action cards from supply and trash as choices', () => {
  const state = new State();
  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  state.trash = [cards.Village];
  state.current.agent.choose = jest.fn(() => ({ mode: LURKER_TRASH, card: cards.Village }));

  const lurker = new Lurker();
  lurker.playEffect(state);

  const [choiceType, , choiceList] = state.current.agent.choose.mock.calls[0];
  expect(choiceType).toBe('lurker');

  const trashChoices = choiceList.filter(c => c.mode === LURKER_TRASH);
  const gainChoices = choiceList.filter(c => c.mode === LURKER_GAIN);

  expect(trashChoices.every(c => c.card.isAction())).toBe(true);
  expect(gainChoices.every(c => c.card.isAction())).toBe(true);
  expect(gainChoices.some(c => c.card === cards.Village)).toBe(true);
});

test('Lurker does not include non-Action supply cards as trash options', () => {
  const state = new State();
  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  state.trash = [];
  state.current.agent.choose = jest.fn((_type, _state, choices) => choices[0]);

  const lurker = new Lurker();
  lurker.playEffect(state);

  const [,, choiceList] = state.current.agent.choose.mock.calls[0];
  const trashChoices = choiceList.filter(c => c.mode === LURKER_TRASH);

  expect(trashChoices.some(c => c.card.isTreasure() && !c.card.isAction())).toBe(false);
  expect(trashChoices.some(c => c.card.isVictory() && !c.card.isAction())).toBe(false);
});

test('Lurker trashes Action card from supply', () => {
  const state = new State();
  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  const supplyCountBefore = state.kingdom[cards.Village];
  const trashSizeBefore = state.trash.length;

  state.current.agent.choose = jest.fn(() => ({ mode: LURKER_TRASH, card: cards.Village }));

  const lurker = new Lurker();
  lurker.playEffect(state);

  expect(state.kingdom[cards.Village]).toBe(supplyCountBefore - 1);
  expect(state.trash.length).toBe(trashSizeBefore + 1);
  expect(state.trash[state.trash.length - 1]).toBe(cards.Village);
});

test('Lurker does not trash from empty supply pile', () => {
  const state = new State();
  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  state.trash = [];
  state.current.agent.choose = jest.fn((_type, _state, choices) => choices[0]);

  const lurker = new Lurker();
  lurker.playEffect(state);

  const [,, choiceList] = state.current.agent.choose.mock.calls[0];
  const trashChoices = choiceList.filter(c => c.mode === LURKER_TRASH);

  expect(trashChoices.every(c => state.kingdom[c.card] > 0)).toBe(true);
});

test('Lurker gains Action card from trash', () => {
  const state = new State();
  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  state.trash = [cards.Smithy];

  const discardSizeBefore = state.current.discard.length;
  state.current.agent.choose = jest.fn(() => ({ mode: LURKER_GAIN, card: cards.Smithy }));

  const lurker = new Lurker();
  lurker.playEffect(state);

  expect(state.trash.includes(cards.Smithy)).toBe(false);
  expect(state.current.discard.length).toBe(discardSizeBefore + 1);
  expect(state.current.discard[0]).toBe(cards.Smithy);
});

test('Lurker deduplicates duplicate Action cards in trash', () => {
  const state = new State();
  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  state.trash = [cards.Village, cards.Village];
  state.current.agent.choose = jest.fn((_type, _state, choices) => choices[0]);

  const lurker = new Lurker();
  lurker.playEffect(state);

  const [,, choiceList] = state.current.agent.choose.mock.calls[0];
  const gainVillageChoices = choiceList.filter(c => c.mode === LURKER_GAIN && c.card === cards.Village);

  expect(gainVillageChoices.length).toBe(1);
});

test('Lurker does nothing when no choices are available', () => {
  const state = new State();
  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  state.trash = [];
  state.kingdom = { Copper: 10, Silver: 10, Gold: 10, Estate: 8, Duchy: 8, Province: 8, Curse: 10 };
  state.current.agent.choose = jest.fn();

  const lurker = new Lurker();
  lurker.playEffect(state);

  expect(state.current.agent.choose).not.toHaveBeenCalled();
});

test('Lurker only offers Action cards from trash as gain options', () => {
  const state = new State();
  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  state.trash = [cards.Copper, cards.Estate, cards.Village];
  state.current.agent.choose = jest.fn((_type, _state, choices) => choices[0]);

  const lurker = new Lurker();
  lurker.playEffect(state);

  const [,, choiceList] = state.current.agent.choose.mock.calls[0];
  const gainChoices = choiceList.filter(c => c.mode === LURKER_GAIN);

  expect(gainChoices.every(c => c.card.isAction())).toBe(true);
  expect(gainChoices.some(c => c.card === cards.Village)).toBe(true);
  expect(gainChoices.some(c => c.card === cards.Copper)).toBe(false);
  expect(gainChoices.some(c => c.card === cards.Estate)).toBe(false);
});
