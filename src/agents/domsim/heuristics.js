/**
 * This is taken from DomCardName
 */
import cards from '../../game/cards.js';

const heuristics = {
  Curse: {discardPriority: 10},
  Copper: {discardPriority: 15, playPriority: 55},
  Silver: {discardPriority: 20, playPriority: 25},
  Gold: {discardPriority: 24, playPriority: 30},
  Estate: { types: [ 'Base', 'Junk' ], discardPriority: 9},
  Duchy: { discardPriority: 8 },
  Province: { discardPriority: 7, trashPriority: 60 },
  Artisan: { types: [ 'Terminal' ], discardPriority: 27, playPriority: 30 },
  Bandit: { types: [ 'Terminal' ], discardPriority: 23, playPriority: 23 },
  Bureaucrat: { types: [ 'Terminal' ], discardPriority: 20, playPriority: 29 },
  Cellar: {types: ['Cycler'], discardPriority: 17, playPriority: 16},
  Chapel: { types: [ 'Terminal' ], discardPriority: 18, playPriority: 37 },
  'Council Room': { types: [ 'Terminal' ], discardPriority: 27, playPriority: 25 },
  Festival: {discardPriority: 26, playPriority: 3},
  Gardens: {discardPriority: 9},
  Harbinger: {types: ['Cycler'], discardPriority: 16, playPriority: 5},
  Laboratory: {types: ['Cycler', 'Card_Advantage'], discardPriority: 40, playPriority: 8},
  Library: { types: [ 'Terminal' ], discardPriority: 30, playPriority: 20 },
  Market: {types: ['Cycler'], discardPriority: 30, playPriority: 13},
  Merchant: {types: ['Cycler'], discardPriority: 19, playPriority: 7},
  Militia: { types: [ 'Terminal' ], discardPriority: 25, playPriority: 30 },
  Mine: { types: [ 'Terminal' ], discardPriority: 22, playPriority: 24 },
  Moat: { types: [ 'Terminal' ], discardPriority: 23, playPriority: 33 },
  Moneylender: {
    types: [ 'Terminal' ],
    discardPriority: 21,
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
    playPriority: 23
  },
  Poacher: {types: ['Cycler'], discardPriority: 30, playPriority: 10},
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
  Village: {types: ['Cycler', 'Village'], discardPriority: 21, playPriority: 5},
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
  Workshop: { types: [ 'Terminal' ], discardPriority: 22, playPriority: 38}
};

export default heuristics;