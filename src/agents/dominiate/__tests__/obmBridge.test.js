import ObmBridge from '../obmBridge.js';
import State from '../../../game/state.js';
import cards from '../../../game/cards.js';

const muteConfig = { log: () => {} };

test('gainPriority at game start', () => {
  const agent = new ObmBridge();
  const state = new State();

  state.setUp([agent, agent], muteConfig);

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [ cards.Gold, cards.Bridge, cards.Bridge, cards.Silver ]
  );
});

test('gainPriority wants Province after first Gold', () => {
  const agent = new ObmBridge();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.current.draw.push(cards.Gold);

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [ cards.Province, cards.Gold, cards.Bridge, cards.Bridge, cards.Silver ]
  );
});

test('Early greening', () => {
  const agent = new ObmBridge();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.current.draw.push(cards.Gold);
  state.gainsToEndGame = () => 6;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [
      cards.Province, cards.Gold, cards.Duchy, cards.Bridge, cards.Bridge,
      cards.Silver
    ]
  );
});

test('Duchy dancing', () => {
  const agent = new ObmBridge();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.current.draw.push(cards.Gold);
  state.gainsToEndGame = () => 4;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [
      cards.Province, cards.Duchy, cards.Gold, cards.Duchy, cards.Bridge,
      cards.Bridge, cards.Silver
    ]
  );
});

test('End game', () => {
  const agent = new ObmBridge();
  const state = new State();

  state.setUp([agent, agent], muteConfig);
  state.current.draw.push(cards.Gold);
  state.gainsToEndGame = () => 2;

  const priority = agent.gainPriority(state, state.current);

  expect(priority).toEqual(
    [
      cards.Province, cards.Duchy, cards.Estate, cards.Gold, cards.Duchy,
      cards.Bridge, cards.Bridge, cards.Silver
    ]
  );
});
