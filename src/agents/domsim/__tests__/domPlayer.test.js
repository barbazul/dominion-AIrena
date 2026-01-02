import { DomPlayer, STRATEGY_STANDARD } from '../domPlayer';
import Player from '../../../game/player';
import BasicAction from '../../../cards/basicAction';
import cards from '../../../game/cards';
import State from '../../../game/state';
import BasicAI from '../../basicAI';
import heuristics from '../heuristics';
import Card from '../../../cards/card';

const muteConfig = { log: () => {}, warn: () => {} };

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
  expect(ai.getPotentialCoins(owner)).toBe(0);
});

test('getPotentialCoins sums value of all cards in hand and previous coins', () => {
  const ai = new DomPlayer();
  const owner = new Player(ai, () => {});

  owner.hand = [ cards.Copper, cards.Silver ];
  owner.coins = 2;
  expect(ai.getPotentialCoins(owner)).toBe(5);
});

test('countCardTypeInDeck counts cards that have a specific type', () => {
  const ai = new DomPlayer();
  const owner = new Player(ai, () => {});

  expect(ai.countCardTypeInDeck(owner, 'Treasure')).toBe(7);
});

test('getPlayStrategyFor defaults to standard strategy', () => {
  const ai = new DomPlayer();

  expect(ai.getPlayStrategyFor(new BasicAction())).toBe(STRATEGY_STANDARD);
});

test('checkForCardToMine', () => {
  const ai = new DomPlayer();
  const state = new State();

  state.setUp([ai, ai], muteConfig);
  const owner = state.current;
  owner.hand = [cards.Copper];

  ai.choose = (choice, state, choices) => {
    return choices[0];
  };

  expect(ai.checkForCardToMine(state, owner).trash).toStrictEqual([cards.Copper]);
});

test('Fallback discard value from heuristics', () => {
  const card = cards.Curse;
  const originalValue = heuristics[card].discardPriority;
  const ai = new DomPlayer();
  const state = new State();

  state.setUp([ai, ai], muteConfig);

  heuristics[card].discardPriority = 0;
  expect(ai.fallbackDiscardValue(state, card, state.current)).toBe(16);

  heuristics[card].discardPriority = 16;
  expect(ai.fallbackDiscardValue(state, card, state.current)).toBe(0);

  heuristics[card].discardPriority = 20;
  expect(ai.fallbackDiscardValue(state, card, state.current)).toBe(-4);

  heuristics[card].discardPriority = originalValue;
});

test('Fallback discard value without heuristics', () => {
  const card = new Card();
  const ai = new DomPlayer();
  const state = new State();

  state.setUp([ai, ai], muteConfig);

  // This expectations assumes current basicAI implementation. Adjust expected value if method changes
  expect(ai.fallbackDiscardValue(state, card, state.current)).toBe(0);
});

test('Discard actions when no actions left', () => {
  const card = cards.Smithy;
  const ai = new DomPlayer();
  const state = new State();

  state.setUp([ai, ai], muteConfig);
  state.current.actions = 0;

  expect(ai.discardValue(state, card, state.current)).toBe(15);
});

test('Check heuristics when actions left', () => {
  const card = cards.Smithy;
  const ai = new DomPlayer();
  const state = new State();

  ai.fallbackDiscardValue = () => -1;
  state.setUp([ai, ai], muteConfig);
  state.current.actions = 2;

  expect(ai.discardValue(state, card, state.current)).toBe(-1);
});

test('Check specific heuristic function first for discardValue', () => {
  const card = new BasicAction();
  const ai = new DomPlayer();
  const state = new State();

  card.name = 'Fake Action';
  heuristics[card] = {
    discardPriority: 10,
    calculatedDiscardPriority: () => -1
  };

  state.setUp([ai, ai], muteConfig);
  expect(ai.discardValue(state, card, state.current)).toBe(-1);
  delete heuristics[card];
});

test('Skip calculated discardValue if not a number', () => {
  const card = new BasicAction();
  const ai = new DomPlayer();
  const state = new State();

  card.name = 'Fake Action';
  heuristics[card] = {
    discardPriority: 10,
    calculatedDiscardPriority: () => false
  };

  state.setUp([ai, ai], muteConfig);
  expect(ai.discardValue(state, card, state.current)).toBe(6);
  delete heuristics[card];
});

test('Get Trash value from heuristics', () => {
  const card = cards.Province;
  const originalValue = heuristics[card].trashPriority;
  const ai = new DomPlayer();
  const state = new State();

  state.setUp([ai, ai]);

  heuristics[card].trashPriority = 0;
  expect(ai.trashValue(state, card, state.current)).toBe(16);

  heuristics[card].trashPriority = 16;
  expect(ai.trashValue(state, card, state.current)).toBe(0);

  heuristics[card].trashPriority = 20;
  expect(ai.trashValue(state, card, state.current)).toBe(-4);

  heuristics[card].trashPriority = originalValue;
});

test('Trash value falls back to discardValue without heuristics', () => {
  const card = cards.Curse;
  const originalTrashValue = heuristics[card].trashPriority;
  const originalDiscardValue = heuristics[card].discardPriority;
  const ai = new DomPlayer();
  const state = new State();

  state.setUp([ai, ai], muteConfig);
  delete heuristics[card].trashPriority;

  heuristics[card].discardPriority = 0;
  expect(ai.trashValue(state, card, state.current)).toBe(16);

  heuristics[card].discardPriority = 16;
  expect(ai.trashValue(state, card, state.current)).toBe(0);

  heuristics[card].discardPriority = 10;
  expect(ai.trashValue(state, card, state.current)).toBe(6);

  heuristics[card].trashPriority = originalTrashValue;
  heuristics[card].discardPriority = originalDiscardValue;
});

test('Check specific heuristic function first for trashValue', () => {
  const card = new BasicAction();
  const ai = new DomPlayer();
  const state = new State();

  card.name = 'Fake Action';
  heuristics[card] = {
    trashPriority: 10,
    calculatedTrashPriority: () => -1
  };

  state.setUp([ai, ai], muteConfig);
  expect(ai.trashValue(state, card, state.current)).toBe(-1);
  delete heuristics[card];
});

test('Skip calculated trashValue if not a number', () => {
  const card = new BasicAction();
  const ai = new DomPlayer();
  const state = new State();

  card.name = 'Fake Action';
  heuristics[card] = {
    trashPriority: 10,
    calculatedTrashPriority: () => false
  };

  state.setUp([ai, ai], muteConfig);
  expect(ai.trashValue(state, card, state.current)).toBe(6);
  delete heuristics[card];
});

test('Always wants to play without heuristic', () => {
  const card = new BasicAction();
  const ai = new DomPlayer();
  const state = new State();

  card.name = 'Fake Action';
  state.setUp([ai, ai], muteConfig);
  expect(ai.wantsToPlay(card, state, state.current)).toBe(true);
});

test('Check specific heuristic function first for wantsToPlay', () => {
  const card = new BasicAction();
  const ai = new DomPlayer();
  const state = new State();

  card.name = 'Fake Action';
  heuristics[card] = {
    wantsToBePlayed: () => false
  };

  state.setUp([ai, ai], muteConfig);
  expect(ai.wantsToPlay(card, state, state.current)).toBe(false);
  delete heuristics[card];
});

test('Fallback playValue without heuristics', () => {
  const card = new Card();
  const ai = new DomPlayer();
  const state = new State();

  state.setUp([ai, ai], muteConfig);

  // This expectations assumes current basicAI implementation. Adjust expected value if method changes
  expect(ai.playValue(state, card, state.current)).toBe(-1);
});

test('playValue from heuristics', () => {
  const card = new Card();
  const ai = new DomPlayer();
  const state = new State();

  state.setUp([ai, ai], muteConfig);
  heuristics[card] = {playPriority: 5};

  // This expectations assumes current basicAI implementation. Adjust expected value if method changes
  expect(ai.playValue(state, card, state.current)).toBe(95);
});

test('playValue from calculated priority', () => {
  const card = new Card();
  const ai = new DomPlayer();
  const state = new State();

  state.setUp([ai, ai], muteConfig);
  heuristics[card] = {
    playPriority: 5,
    calculatedPlayPriority: () => 77
  };

  // This expectations assumes current basicAI implementation. Adjust expected value if method changes
  expect(ai.playValue(state, card, state.current)).toBe(77);
});

test('playPriority is sorted by value', () => {
  const testCards = [cards.Copper, cards.Silver, cards.Gold];
  const ai = new DomPlayer();
  const state = new State();

  state.setUp([ai, ai], muteConfig);

  ai.playValue = (state, card) => card.coins;
  state.current.hand = testCards;

  let priority = ai.playPriority(state, state.current);

  expect(priority).toEqual(testCards.toReversed());
});

test('playPriority filters unwanted cards', () => {
  const testCards = [cards.Copper, cards.Silver, cards.Copper];
  const ai = new DomPlayer();
  const state = new State();

  state.setUp([ai, ai], muteConfig);

  ai.wantsToPlay = (card, state, player) => card.name !== 'Copper';
  state.current.hand = testCards;

  let priority = ai.playPriority(state, state.current);

  expect(priority).toEqual([cards.Silver]);
});
