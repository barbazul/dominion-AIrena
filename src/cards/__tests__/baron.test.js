import Baron from "../baron";
import State from "../../game/state";
import BasicAI, {CHOICE_DISCARD} from "../../agents/basicAI";
import cards from "../../game/cards";

const muteConfig = { log: () => {}, warn: () => {} };

test('Baron card definition', () => {
  const card = new Baron();

  expect(card.toString()).toBe('Baron');
  expect(card.cost).toBe(4);
  expect(card.buys).toBe(1);
  expect(card.isAction()).toBe(true);
});

test('Played with empty hand gains an Estate', () => {
  const state = new State();
  const card = new Baron();

  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  state.current.hand = [];
  state.current.discard = [];
  state.current.agent.choose = jest.fn(() => null);
  state.gainCard = jest.fn(() => {});

  card.playEffect(state);

  expect(state.gainCard).toHaveBeenCalledWith(state.current, cards.Estate);
  expect(state.current.agent.choose).not.toHaveBeenCalled();
});

test('Call for discard choice', () => {
  const state = new State();
  const card = new Baron();

  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  state.current.hand = [ cards.Estate ];
  state.current.agent.choose = jest.fn(() => null);

  card.playEffect(state);

  expect(state.current.agent.choose).toHaveBeenCalledWith(CHOICE_DISCARD, state, [ null, cards.Estate ]);
});

test('Discarded Estate, gain coins', () => {
  const state = new State();
  const card = new Baron();

  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  state.current.hand = [ cards.Estate ];
  state.current.coins = 0;
  state.current.agent.choose = jest.fn(() => cards.Estate);

  card.playEffect(state);

  expect(state.current.hand.length).toEqual(0);
  expect(state.current.coins).toEqual(4);
});
