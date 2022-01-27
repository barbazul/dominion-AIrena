import SingleBaron from '../singleBaron.js';
import State from '../../../game/state.js';
import cards from '../../../game/cards.js';

const muteConfig = { log: () => {} };

test('gainPriority at game start', () => {
  const agent = new SingleBaron();
  const state = new State();

  state.setUp([agent, agent], muteConfig);

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [ cards.Province, cards.Gold, cards.Baron, cards.Silver ]
  );
});

test('Duchy dancing', () => {
  const agent = new SingleBaron();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.gainsToEndGame = () => 5;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [ cards.Province, cards.Duchy, cards.Gold, cards.Baron, cards.Silver ]
  );
});

test('End game', () => {
  const agent = new SingleBaron();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.gainsToEndGame = () => 2;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [
      cards.Province, cards.Duchy, cards.Estate, cards.Gold, cards.Baron,
      cards.Silver, cards.Copper
    ]
  );
});

test('Only buy a single Baron', () => {
  const agent = new SingleBaron();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.current.draw.push(cards.Baron);

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [ cards.Province, cards.Gold, cards.Silver ]
  );
});

test('discardPriority at game start', () => {
  const agent = new SingleBaron();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.current.hand = [];

  const priority = agent.discardPriority(state, state.current);

  expect(priority).toEqual(
    [
      cards.Province, cards.Duchy, cards.Curse, cards.Estate, cards.Copper,
      cards.Baron, null, cards.Silver, cards.Estate, cards.Baron
    ]
  );
});

test('Keep single Estate with Baron in hand', () => {
  const agent = new SingleBaron();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.current.hand = [ cards.Baron, cards.Estate ];

  const priority = agent.discardPriority(state, state.current);

  expect(priority).toEqual(
    [
      cards.Province, cards.Duchy, cards.Curse, cards.Copper, null,
      cards.Silver, cards.Estate, cards.Baron
    ]
  );
});
