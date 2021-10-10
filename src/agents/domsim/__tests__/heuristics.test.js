import { DomPlayer } from '../domPlayer';
import State from '../../../game/state';
import cards from '../../../game/cards';
import heuristics from '../heuristics';

test('Prefer discard Monelender with no coppers on hand', () => {
  const ai = new DomPlayer();
  const state = new State();
  const card = cards.Moneylender;

  state.setUp([ai, ai], {log: () => {}, warn: () => {}});
  state.current.hand = [ card ];

  expect(heuristics[card].calculatedDiscardPriority(state, card, state.current)).toBe(16);
});

test('Moneylender skips calculated discard priority with coppers on hand', () => {
  const ai = new DomPlayer();
  const state = new State();
  const card = cards.Moneylender;

  state.setUp([ai, ai], {log: () => {}, warn: () => {}});
  state.current.hand = [ card, cards.Copper ];

  expect(heuristics[card].calculatedDiscardPriority(state, card, state.current)).toBe(false);
});

test('Prefer discard Throne Room with no actions to copy', () => {
  const ai = new DomPlayer();
  const state = new State();
  const card = cards["Throne Room"];

  state.setUp([ai, ai], {log: () => {}, warn: () => {}});
  state.current.hand = [ card ];

  expect(heuristics[card].calculatedDiscardPriority(state, card, state.current)).toBe(15);
});

test('Throne Room skips calculated discard priority with other actions on hand', () => {
  const ai = new DomPlayer();
  const state = new State();
  const card = cards["Throne Room"];

  state.setUp([ai, ai], {log: () => {}, warn: () => {}});
  state.current.hand = [ card, cards.Smithy ];

  expect(heuristics[card].calculatedDiscardPriority(state, card, state.current)).toBe(false);
});

test('Witch calculated discard priority is treated as Moat\'s if no curses left', () => {
  const ai = new DomPlayer();
  const state = new State();
  const card = cards.Witch;
  let moatDiscardValue;

  state.setUp([ai, ai], {log: () => {}, warn: () => {}});
  state.kingdom.Curse = 0;
  moatDiscardValue = ai.discardValue(state, cards.Moat, state.current);

  expect(heuristics[card].calculatedDiscardPriority(state, card, state.current)).toBe(moatDiscardValue);
});

test('Witch skips calculated discard priority with curses in supply', () => {
  const ai = new DomPlayer();
  const state = new State();
  const card = cards.Witch;

  state.setUp([ai, ai], {log: () => {}, warn: () => {}});
  expect(heuristics[card].calculatedDiscardPriority(state, card, state.current)).toBe(false);
});
