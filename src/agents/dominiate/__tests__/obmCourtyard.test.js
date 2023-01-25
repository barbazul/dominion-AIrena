import ObmCourtyard from "../obmCourtyard.js";
import State from "../../../game/state.js";
import cards from "../../../game/cards.js";

const muteConfig = {
  log: () => {
  }
};

test('gainPriority at game start', () => {
  const agent = new ObmCourtyard();
  const state = new State();

  state.setUp([agent, agent], muteConfig);

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [
      cards.Gold, cards.Silver, cards.Courtyard, cards.Courtyard, cards.Silver,
      cards.Courtyard
    ]
  );
});

test('gainPriority Province after first Gold', () => {
  const agent = new ObmCourtyard();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.current.draw.push(cards.Gold);

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [
      cards.Province,
      cards.Gold, cards.Silver, cards.Courtyard, cards.Courtyard, cards.Silver,
      cards.Courtyard
    ]
  );
});

test('gainPriority Duchy dancing A', () => {
  const agent = new ObmCourtyard();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.gainsToEndGame = () => 5;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [
      cards.Gold, cards.Duchy, cards.Silver, cards.Courtyard, cards.Courtyard,
      cards.Silver, cards.Courtyard
    ]
  );
});

test('gainPriority Duchy dancing B', () => {
  const agent = new ObmCourtyard();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.gainsToEndGame = () => 4;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [
      cards.Duchy, cards.Gold, cards.Duchy, cards.Silver, cards.Courtyard,
      cards.Courtyard, cards.Silver, cards.Courtyard
    ]
  );
});

test('gainPriority Estate on endgame', () => {
  const agent = new ObmCourtyard();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.gainsToEndGame = () => 2;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [
      cards.Duchy, cards.Estate, cards.Gold, cards.Duchy, cards.Silver,
      cards.Courtyard, cards.Courtyard, cards.Silver, cards.Courtyard
    ]
  );
});

test('gainPriority 1st Silver over 1st Courtyard', () => {
  const agent = new ObmCourtyard();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.current.draw.push(cards.Silver);

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [
      cards.Gold, cards.Courtyard, cards.Courtyard, cards.Silver,
      cards.Courtyard
    ]
  );
});

test('gainPriority switch to treasure after first Courtyard', () => {
  const agent = new ObmCourtyard();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.current.draw.push(cards.Courtyard);

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [cards.Gold, cards.Silver, cards.Silver, cards.Courtyard]
  );
});

test('gainPriority Stop Courtyard fallback after second', () => {
  const agent = new ObmCourtyard();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.current.draw.push(cards.Courtyard, cards.Courtyard);

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [cards.Gold, cards.Silver, cards.Silver]
  );
});

test('gainPriority prioritize Courtyard again every 8 treasures', () => {
  const agent = new ObmCourtyard();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.current.draw.push(cards.Courtyard, cards.Copper, cards.Copper);

  let priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [
      cards.Gold, cards.Silver, cards.Courtyard, cards.Silver, cards.Courtyard
    ]
  );

  state.current.draw.push(
    cards.Courtyard, cards.Copper, cards.Copper, cards.Copper, cards.Copper,
    cards.Copper, cards.Copper, cards.Copper, cards.Copper
  );

  priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [
      cards.Gold, cards.Silver, cards.Courtyard, cards.Silver
    ]
  );
});
