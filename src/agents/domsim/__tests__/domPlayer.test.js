import { DomPlayer, STRATEGY_STANDARD } from '../domPlayer';
import Player from '../../../game/player';
import BasicAction from '../../../cards/basicAction';
import cards from '../../../game/cards';
import State from '../../../game/state';
import BasicAI from '../../basicAI';
import heuristics from '../heuristics';
import Card from '../../../cards/card';

const muteConfig = { log: () => {}, warn: () => {} };

describe('DomPlayer', () => {
  describe('with findCardToRemodel', () => {
    test('findCardToRemodel returns null when no cards to remodel', () => {
      const ai = new DomPlayer();
      const owner = new Player(ai, () => {});

      const myMock = {
        hand: [],
      };

      const stateMock = {};

      expect(ai.findCardToRemodel(myMock, stateMock, cards.Remodel, 2, true)).toBe(null);
    });

    test('findCardToRemodel finds an obvious card', () => {
      const ai = new DomPlayer();
      const owner = new Player(ai, () => {});
      const state = new State();
      state.setUp([ai, ai], muteConfig);
      state.current.hand = [cards.Estate];

      expect(ai.findCardToRemodel(state.current, state, cards.Remodel, 2, true)).toBe(cards.Estate);
    });

    test('findCardToRemodel finds skips the excluded card', () => {
      const ai = new DomPlayer();
      const owner = new Player(ai, () => {});
      const state = new State();
      state.setUp([ai, ai], muteConfig);
      state.current.hand = [cards.Remodel, cards.Estate];

      expect(ai.findCardToRemodel(state.current, state, cards.Remodel, 2, true)).toBe(cards.Estate);
    });

    test('findCardToRemodel selects the best card to trash to gain a card with a better trash value on late game', () => {
      const ai = new DomPlayer();
      const state = new State();
      state.setUp([ai, ai], muteConfig);
      // Copper allows to gain Estate, but Estate allows to gain Silver, which has a higher trash value
      state.current.hand = [cards.Copper, cards.Estate];
      state.current.discard = [cards.Province];
      state.kingdom = { Silver: 10, Estate: 8 };

      expect(ai.findCardToRemodel(state.current, state, cards.Remodel, 2, true)).toBe(cards.Estate);
    });

    test('findCardToRemodel does not care about the best card to trash to gain a card with a better trash value on early game', () => {
      const ai = new DomPlayer();
      const state = new State();
      state.setUp([ai, ai], muteConfig);
      // Copper allows to gain Estate, but Estate allows to gain Silver, which has a higher trash value
      state.current.hand = [cards.Copper, cards.Estate];
      state.kingdom = { Silver: 10, Estate: 8 };

      expect(ai.findCardToRemodel(state.current, state, cards.Remodel, 2, true)).toBe(cards.Copper);
    });

    test('findCardToRemodel selects the a card that is mode desirable to trash when gain is equal', () => {
      const ai = new DomPlayer();
      const state = new State();
      state.setUp([ai, ai], muteConfig);
      // Copper and Curse allow to gain Estate, but Curse is a nicer Trash
      state.current.hand = [cards.Copper, cards.Curse];
      state.kingdom = { Estate: 8 };

      expect(ai.findCardToRemodel(state.current, state, cards.Remodel, 2, true)).toBe(cards.Curse);
    });
  })

  describe('with stillInEarlyGame', () => {
    it('Defaults to true', () => {
      const ai = new DomPlayer();
      const owner = new Player(ai, () => {});
      const state = new State();

      state.current = owner;
      owner.getDeck = () => [ ];
      expect(ai.stillInEarlyGame(state, owner)).toBe(true);
    });

    it('Returns false when deck contains victory cards we want to discard', () => {
      const ai = new DomPlayer();
      const owner = new Player(ai, () => {});
      const state = new State();

      state.current = owner;
      owner.getDeck = () => [ cards.Duchy ];
      expect(ai.stillInEarlyGame(state, owner)).toBe(false);
    });

    it('Ignores Estates', () => {
      const ai = new DomPlayer();
      const owner = new Player(ai, () => {});
      const state = new State();

      state.current = owner;
      expect(ai.stillInEarlyGame(state, owner)).toBe(true);
    });

    it('Only Considers vitory cards', () => {
      const ai = new DomPlayer();
      const owner = new Player(ai, () => {});
      const state = new State();

      ai.discardValue = () => 10; // Force discard intent
      state.current = owner;
      owner.getDeck = () => [ cards.Artisan ]; // Action should not be considered
      expect(ai.stillInEarlyGame(state, owner)).toBe(true);
    });
  });

  describe('with countTerminalsInDeck', () => {
    test('countTerminalsInDeck returns 0 with empty deck', () => {
      const ai = new DomPlayer();
      const owner = new Player(ai, () => {});

      owner.getDeck = () => [];
      expect(ai.countTerminalsInDeck(owner)).toBe(0);
    });

    test('countTerminalsInDeck counts deck full of terminals', () => {
      const ai = new DomPlayer();
      const owner = new Player(ai, () => {});

      owner.getDeck = () => [ cards.Militia, cards.Artisan ];
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
  });

  describe('with getTotalMoney', () => {
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
  });

  describe('with getPotentialCoinValue', () => {
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
  });

  describe('with removingReducesBuyingPower', () => {
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
  });

  describe('with getPotentialCoins', () => {
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
  });

  describe('with countCardTypeInDeck', () => {
    test('countCardTypeInDeck counts cards that have a specific type', () => {
      const ai = new DomPlayer();
      const owner = new Player(ai, () => {});

      expect(ai.countCardTypeInDeck(owner, 'Treasure')).toBe(7);
    });
  });

  describe('with getPlayStrategyFor', () => {
    test('getPlayStrategyFor defaults to standard strategy', () => {
      const ai = new DomPlayer();

      expect(ai.getPlayStrategyFor(new BasicAction())).toBe(STRATEGY_STANDARD);
    });
  });

  describe('with checkForCardToMine', () => {
    test('checkForCardToMine returns an upgrade choice', () => {
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
  });

  describe('with discardValue', () => {
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
  });

  describe('with trashValue', () => {
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
  });

  describe('with wantsToPlay', () => {
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
  });

  describe('with playValue', () => {
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
  });

  describe('with playPriority', () => {
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
  });
});
