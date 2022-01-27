import SingleBaron from "../singleBaron.js";
import State from "../../../game/state.js";
import cards from "../../../game/cards.js";

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
