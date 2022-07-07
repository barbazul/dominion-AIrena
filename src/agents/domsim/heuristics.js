/**
 * This is taken from DomCardName
 */
import cards from '../../game/cards.js';
import { STRATEGY_AGGRESSIVE_TRASHING, STRATEGY_STANDARD, STRATEGY_TRASH_WHEN_OBSOLETE } from './domPlayer.js';
import { CHOICE_TRASH } from '../basicAI.js';

const helpers = {
  /**
   * Safely check agent play strategy for card.
   *
   * Allow for agents that don't implement `getPlayStrategyFor`.
   *
   * @param {BasicAI} agent
   * @param {Card} card
   */
  getPlayStrategyFor: (agent, card) => {
    if (typeof agent.getPlayStrategyFor === 'function') {
      return agent.getPlayStrategyFor(card);
    }

    return STRATEGY_STANDARD;
  }
};

const heuristics = {
  Curse: { discardPriority: 10, trashPriority: 0 },
  Copper: { discardPriority: 15, playPriority: 55 },
  Silver: {
    discardPriority: 20,
    playPriority: 25,

    /**
     * Consider the trashWhenObsolete strategy.
     *
     * Basically consider Silver obsolete when one of the following:
     *
     * - King's Courts and Golds are owned
     * - 10+ actions are owned
     * - 4+ Silvers are owned
     *
     * @param {State} state
     * @param {Card} card
     * @param {Player} my
     */
    calculatedTrashPriority: (state, card, my) => {
      let strategy;

      strategy = helpers.getPlayStrategyFor(my.agent, card);
      if (strategy === STRATEGY_TRASH_WHEN_OBSOLETE) {
        // TODO Kings Court check to be implemented later

        if (my.countTypeInDeck('Action') > 9 || my.countInDeck(cards.Silver) > 3) {
          return 1;
        }
      }

      return false;
    }
  },
  Gold: { discardPriority: 24, playPriority: 30 },
  Estate: {
    types: [ 'Base', 'Junk' ],
    discardPriority: 9,
    trashPriority: 100,

    /**
     * Avoid trashing when collecting estates
     *
     * @param {State} state
     * @param {Card} card
     * @param {Player} my
     */
    calculatedTrashPriority: (state, card, my) => {
      if (my.agent.wantsToGainOrKeep && my.agent.wantsToGainOrKeep(card, state, my)) {
        return -19;
      }

      return false;
    }
  },
  Duchy: {
    discardPriority: 8,
    trashPriority: 100,

    /**
     * Avoid trashing when collecting duchies
     *
     * @param {State} state
     * @param {Card} card
     * @param {Player} my
     */
    calculatedTrashPriority: (state, card, my) => {
      if (my.agent.wantsToGainOrKeep && my.agent.wantsToGainOrKeep(card, state, my)) {
        return -24;
      }

      return false;
    }
  },
  Province: { discardPriority: 7, trashPriority: 60 },
  Artisan: { types: [ 'Terminal' ], discardPriority: 27, playPriority: 30 },
  Bandit: { types: [ 'Terminal' ], discardPriority: 23, playPriority: 23 },
  Bureaucrat: { types: [ 'Terminal' ], discardPriority: 20, playPriority: 29 },
  Cellar: { types: ['Cycler'], discardPriority: 17, playPriority: 16 },
  Chapel: {
    types: [ 'Terminal' ],
    discardPriority: 18,
    playPriority: 37,

    /**
     * Will avoid trashing if it loses money below a threshold
     *
     * @param {State} state
     * @param {Player} my
     * @return {boolean}
     */
    wantsToBePlayed: (state, my) => {
      if (my.hand.length === 0) {
        return false;
      }

      const isAggressive = helpers.getPlayStrategyFor(my.agent, cards.Chapel) === STRATEGY_AGGRESSIVE_TRASHING;
      const minMoneyInDeck = isAggressive ? 4 : 6;
      const trashOverBuyThreshold = isAggressive ? 3 : 4;
      const cardsInHand = my.hand.slice(0);
      const totalMoney = my.agent.getTotalMoney(my);
      let trashCount = 0;

      for (let card of cardsInHand) {
        if (my.agent.trashValue(state, card, my) > 0) {
          trashCount++;
        }
      }

      let cardToTrash = my.agent.choose(CHOICE_TRASH, state, my.hand);

      // Optimization: Avoid recalculating value
      // my.agent.trashValue(state, cardToTrash, my) > 0 &&
      return trashCount > 0 &&
        (
          !my.agent.removingReducesBuyingPower(my, state, cardToTrash) ||
          trashCount >= trashOverBuyThreshold
        ) &&
        (
          totalMoney - my.agent.getPotentialCoinValue(my, cardToTrash) >= minMoneyInDeck ||
          totalMoney < minMoneyInDeck
        );
    }
  },
  'Council Room': { types: [ 'Terminal' ], discardPriority: 27, playPriority: 25 },
  Festival: { discardPriority: 26, playPriority: 3 },
  Gardens: {
    discardPriority: 9,
    playPriority: 100,

    /**
     * Avoid trashing when collecting gardens
     *
     * @param {State} state
     * @param {Card} card
     * @param {Player} my
     */
    calculatedTrashPriority: (state, card, my) => {
      if (my.agent.wantsToGainOrKeep && my.agent.wantsToGainOrKeep(card, state, my)) {
        return -49;
      }

      return false;
    }
  },
  Harbinger: { types: ['Cycler'], discardPriority: 16, playPriority: 5 },
  Laboratory: { types: ['Cycler', 'Card_Advantage'], discardPriority: 40, playPriority: 8 },
  Library: { types: [ 'Terminal' ], discardPriority: 30, playPriority: 20 },
  Market: { types: ['Cycler'], discardPriority: 30, playPriority: 13 },
  Merchant: { types: ['Cycler'], discardPriority: 19, playPriority: 7 },
  Militia: { types: [ 'Terminal' ], discardPriority: 25, playPriority: 30 },
  Mine: { types: [ 'Terminal' ], discardPriority: 22, playPriority: 24 },
  Moat: { types: [ 'Terminal' ], discardPriority: 23, playPriority: 33 },
  Moneylender: {
    types: [ 'Terminal' ],
    discardPriority: 21,
    playPriority: 23,

    /**
     * Prefer to discard Moneylender with no Coppers on hand
     *
     * @param {State} state
     * @param {Card} card
     * @param {Player} my
     */
    calculatedDiscardPriority: (state, card, my) => {
      if (my.countInHand(cards.Copper) === 0) {
        return 16;
      }

      return false;
    },

    /**
     * When there are no more Coppers in Deck, Moneylender is slightly better than Curse
     *
     * @param {State} state
     * @param {Card} card
     * @param {Player} my
     */
    calculatedTrashPriority: (state, card, my) => {
      if (my.countInDeck(cards.Copper) === 0) {
        return 16 - heuristics[cards.Curse].trashPriority - 1;
      }

      return false;
    }
  },
  Poacher: { types: ['Cycler'], discardPriority: 30, playPriority: 10 },
  Remodel: { types: [ 'Terminal' ], discardPriority: 18, playPriority: 24 },
  Sentry: { types: ['Cycler'], discardPriority: 22, playPriority: 2 },
  Smithy: { types: [ 'Terminal' ], discardPriority: 24, playPriority: 25 },
  'Throne Room': {
    discardPriority: 22,
    playPriority: 7,
    /**
     * Prefer to discard Throne Room with no actions to multiply
     *
     * @param {State} state
     * @param {Card} card
     * @param {Player} my
     */
    calculatedDiscardPriority: (state, card, my) => {
      if (my.agent.countCardTypeInDeck && my.hand.filter(c => c.isAction()).length === my.countInHand(card)) {
        return 15;
      }

      return false;
    }
  },
  Vassal: { types: [ 'Terminal' ], discardPriority: 23, playPriority: 25 },
  Village: { types: ['Cycler', 'Village'], discardPriority: 21, playPriority: 5 },
  Witch: {
    types: [ 'Terminal' ],
    discardPriority: 40,

    /**
     * Treat Witch as Moat when no Curses left
     *
     * @param {State} state
     * @param {Card} card
     * @param {Player} my
     */
    calculatedDiscardPriority: (state, card, my) => {
      if (state.countInSupply(cards.Curse) === 0) {
        return my.agent.discardValue(state, cards.Moat, my);
      }

      return false;
    },
    playPriority: 18
  },
  Workshop: { types: [ 'Terminal' ], discardPriority: 22, playPriority: 38 }
};

export default heuristics;
