
import State from '../../../game/state.js';
import Farm from '../farm.js';
import cards from '../../../game/cards.js';

const muteConfig = { log: () => {} };

test('gainPriority at start of game', () => {
  const ai = new Farm();
  const state = new State();

  state.setUp([ai, ai], muteConfig);
  state.kingdom[cards.Farm] = 8;

  expect(ai.gainPriority(state, state.current))
      .toEqual([
        cards.Gold,
        cards.Silver
      ]);
});

test('gainPriority wants Province with high money', () => {
  const agent = new Farm();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  agent.getTotalMoney = () => 23;
  state.kingdom[cards.Farm] = 8;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toContain(cards.Province);
});

test('gainPriority wants Farm when Province pile is getting low', () => {
  const agent = new Farm();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.kingdom[cards.Province] = 6;
  state.kingdom[cards.Farm] = 8;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toContain(cards.Farm);
});

test('gainPriority wants Duchy when Province pile is very low', () => {
  const agent = new Farm();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.kingdom[cards.Province] = 2;
  state.kingdom[cards.Farm] = 8;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toContain(cards.Duchy);
});

test('gainPriority includes multiple Duchy opportunities', () => {
  const agent = new Farm();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.kingdom[cards.Province] = 4;
  state.kingdom[cards.Farm] = 8;

  const priority = agent.gainPriority(state, state.current);

  const countOccurrences = (arr, val) => arr.reduce((count, current) => {
    return count + (current === val);
  }, 0);

  expect(countOccurrences(priority, cards.Duchy)).toBeGreaterThanOrEqual(2);
});