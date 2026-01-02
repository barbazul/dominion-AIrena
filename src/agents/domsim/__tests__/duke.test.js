import State from '../../../game/state.js';
import Duke from '../duke.js';
import cards from '../../../game/cards.js';

const muteConfig = { log: () => {} };

test('gainPriority at start of game', () => {
  const ai = new Duke();
  const state = new State();

  state.setUp([ai, ai], muteConfig);
  state.kingdom[cards.Duke] = 8;

  expect(ai.gainPriority(state, state.current))
    .toEqual([
        cards.Gold,
        cards.Silver,
        cards.Copper
    ]);
});

test('gainPriority wants Duchy after accumulating enough money', () => {
  const agent = new Duke();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.current.getTotalMoney = () => 99;
  state.kingdom[cards.Duke] = 8;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
      [
        cards.Duchy,
        cards.Gold,
        cards.Silver,
        cards.Copper
      ]
  );
});

test('gainPriority wants Province when Duchies are gone', () => {
    const agent = new Duke();
    const state = new State();

    state.setUp([agent, agent], muteConfig);
    state.kingdom[cards.Duchy] = 0;
    state.kingdom[cards.Duke] = 8;
    state.current.countInDeck = () => 6;

    const priority = agent.gainPriority(state, state.current);

    expect(priority).toEqual(
        [
            cards.Province,
            cards.Duke,
            cards.Gold,
            cards.Silver,
            cards.Copper
        ]
    );
});

test('gainPriority wants Duke when Duchies are gone', () => {
    const agent = new Duke();
    const state = new State();

    state.setUp([agent, agent], muteConfig);
    state.kingdom[cards.Duchy] = 0;
    state.kingdom[cards.Duke] = 8;
    state.current.countInDeck = () => 7;

    const priority = agent.gainPriority(state, state.current);

    expect(priority).toEqual(
        [
            cards.Duke,
            cards.Gold,
            cards.Silver,
            cards.Copper
        ]
    );
});

test('gainPriority wants Estate when Dukes are running low', () => {
    const agent = new Duke();
    const state = new State();

    state.setUp([agent, agent], muteConfig);
    state.kingdom[cards.Duke] = 3;

    const priority = agent.gainPriority(state, state.current);

    expect(priority).toEqual(
        [
            cards.Estate,
            cards.Gold,
            cards.Silver,
            cards.Copper
        ]
    );
});