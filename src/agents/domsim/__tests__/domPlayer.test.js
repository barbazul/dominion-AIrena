import { DomPlayer } from '../domPlayer';
import Player from '../../../game/player';
import BasicAction from '../../../cards/basicAction';
import cards from '../../../game/cards';
import State from "../../../game/state";
import BasicAI from "../../basicAI";

test('countTerminalsInDeck returns 0 with empty deck', () => {
  const ai = new DomPlayer();
  const owner = new Player(ai, () => {});

  owner.getDeck = () => [];
  expect(ai.countTerminalsInDeck(owner)).toBe(0);
});

test('countTerminalsInDeck counts deck full of terminals', () => {
  const ai = new DomPlayer();
  const owner = new Player(ai, () => {});

  owner.getDeck = () => [ new BasicAction(), new BasicAction() ];
  expect(ai.countTerminalsInDeck(owner)).toBe(2);
});

test('countTerminalsInDeck returns 0 with deck without actions', () => {
  const ai = new DomPlayer();
  const owner = new Player(ai, () => {});

  owner.getDeck = () => [ cards.Copper, cards.Copper ];
  expect(ai.countTerminalsInDeck(owner)).toBe(0);
});

test('countTerminalsInDeck ignores villages and cantrips', () => {
  const ai = new DomPlayer();
  const owner = new Player(ai, () => {});

  owner.getDeck = () => [ cards.Village, cards.Market, cards.Militia ];
  expect(ai.countTerminalsInDeck(owner)).toBe(1);
});

test('getTotalMoney returns 0 for empty deck', () => {
  const ai = new DomPlayer();
  const owner = new Player(ai, () => {});

  owner.getDeck = () => [];
  expect(ai.getTotalMoney(owner)).toBe(0);
});

test('getTotalMoney counts all coin producing cards', () => {
  const ai = new DomPlayer();
  const owner = new Player(ai, () => {});

  owner.getDeck = () => [ cards.Gold, cards.Market, cards.Militia ];
  expect(ai.getTotalMoney(owner)).toBe(6);
});

test('getPotentialCoinValue returns 0 for a card that does not provide coins', () => {
  const ai = new DomPlayer();
  const owner = new Player(ai, () => {});

  expect(ai.getPotentialCoinValue(owner, cards.Village)).toBe(0);
});

test('getPotentialCoinValue defaults to card coin value', () => {
  const ai = new DomPlayer();
  const owner = new Player(ai, () => {});

  expect(ai.getPotentialCoinValue(owner, cards.Gold)).toBe(3);
});

test('Actions provide 0 potential coins with no actions left', () => {
  const ai = new DomPlayer();
  const owner = new Player(ai, () => {});

  owner.actions = 0;
  expect(ai.getPotentialCoinValue(owner, cards.Festival)).toBe(0);
});

test('removingReducesBuyingPower returns false for cards that don\'t provide coins', () => {
  const ai = new DomPlayer();
  const owner = new Player(ai, () => {});
  const state = new State();

  state.current = owner;
  expect(ai.removingReducesBuyingPower(owner, state, cards.Village)).toBe(false);
});

test('removingReducesBuyingPower returns true when buy decision changes', () => {
  const ai = new DomPlayer();
  const state = new State();
  let player;

  state.setUp([ ai, new BasicAI() ], { log: () => {}, warn: () => {} });
  ai.gainPriority = () => [cards.Gold, cards.Silver];
  player = ai.myPlayer(state);
  state.current = player;
  player.coins = 5;
  player.hand = [ cards.Copper ];

  expect(ai.removingReducesBuyingPower(player, state, cards.Copper)).toBe(true);
});


test('getPotentialCoins returns 0 on empty hand and no previous coins', () => {
  const ai = new DomPlayer();
  const owner = new Player(ai, () => {});

  owner.hand = [];
  owner.coins = 0;
  expect(ai.getPotentialCoins(owner)).toBe(0)
});

test('getPotentialCoins sums value of all cards in hand and previous coins', () => {
  const ai = new DomPlayer();
  const owner = new Player(ai, () => {});

  owner.hand = [ cards.Copper, cards.Silver ];
  owner.coins = 2;
  expect(ai.getPotentialCoins(owner)).toBe(5)
});
