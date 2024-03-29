import cards from '../../game/cards';
import BasicAI, {CHOICE_TRASH, CHOICE_UPGRADE} from '../basicAI';
import heuristics from './heuristics';

export class DomPlayer extends BasicAI {
  constructor() {
    super();
    this.playStrategies = {};
  }

  /**
   *
   * @param {Player} my
   * @return {number}
   */
  countTerminalsInDeck(my) {
    let count = 0;
    for (let card of my.getDeck()) {
      if (card.isAction() && card.actions === 0) {
        count++;
      }
    }

    return count;
  }

  /**
   * @param {State} state
   * @param {Player} my
   * @return {String[]|Card[]}
   */
  playPriority(state, my) {
    let choices = my.hand.slice(0).sort(
      (card1, card2) => this.playValue(state, cards[card2], my) -
        this.playValue(state, cards[card1], my)
    );

    return choices.filter(cardName => this.wantsToPlay(cardName, state, my));
  }

  /**
   * Play value mapped from aPlayPriority argument in DomCardName
   *
   * Value is substracted from 100 as sorting in DomSim is ascending
   *
   * @param {State} state
   * @param {Card} card
   * @param {Player} my
   * @returns {Number|*}
   */
  playValue(state, card, my) {
    // TODO Move this into heuristics
    const specific = {
      Vassal: (state, my) => {
        if (
          my.knownTopCards > 0 && my.draw[0].isAction() &&
          !(heuristics[my.draw[0]].types && heuristics[my.draw[0]].types.indexOf('Terminal') > -1)
        ) {
            return 99;
        }

        if (my.knownTopCards > 0 && my.draw[0].isAction() && my.actions > 1) {
          return 99;
        }

        return 100 - heuristics.Vassal.playPriority;
      }
    }

    if (specific[card]) {
      return specific[card](state, my);
    }

    if (heuristics[card].playPriority !== undefined) {
      return 100 - heuristics[card].playPriority;
    }

    return super.playValue(state, card, my);
  }

  /**
   *
   * @param {String|Card} cardName
   * @param {State} state
   * @param {Player} my
   * @return {boolean}
   */
  wantsToPlay(cardName, state, my) {
    // TODO Move into heuristics
    const specific = {
      Chapel: (state, my) => {
        const minMoneyInDeck = this.getPlayStrategyFor('Chapel') === STRATEGY_AGGRESSIVE_TRASHING ? 4 : 6;
        const trashOverBuyThreshold = this.getPlayStrategyFor('Chapel') === STRATEGY_AGGRESSIVE_TRASHING ? 3 : 4;
        let trashCount = 0;
        const cardsInHand = my.hand.slice(0);

        if (my.hand.length === 0) {
          return false;
        }

        for (let card of cardsInHand) {
          if (this.trashValue(state, card, my) > 0) {
            trashCount++;
          }
        }

        let cardToTrash = this.choose(CHOICE_TRASH, state, my.hand);

        return this.trashValue(state, cardToTrash, my) > 0 ||
          this.removingReducesBuyingPower(my, state, cardToTrash) && trashCount < trashOverBuyThreshold ||
          this.getTotalMoney(my) - this.getPotentialCoinValue(my, cardToTrash) < minMoneyInDeck
          && this.getTotalMoney(my) >= minMoneyInDeck;


      },
      Mine: (state, my) => {
        return this.checkForCardToMine(state, my) !== null;
      },
      Smithy: (state, my) => {
        return !(this.getPlayStrategyFor('Smithy') === STRATEGY_PLAY_IF_NOT_BUYING_TOP_CARD &&
          this.isGoingToBuyTopCardInBuyRules(state, my));
      }
    };

    if (specific[cardName]) {
      return specific[cardName](state, my);
    }

    return true;
  }

  /**
   * DomSim trashValue defaults to discard value as if player had 1 action left
   *
   * @param {State} state
   * @param {Card} card
   * @param {Player} my
   */
  trashValue(state, card, my) {
    // TODO Some cards have specific trashValue functions
    // TODO Duchy if (owner!=null && owner.wantsToGainOrKeep(DomCardName.Duchy)) return 40;

    if (heuristics[card].trashPriority) {
      return 16 - heuristics[card].trashPriority;
    }

    return this.fallbackDiscardValue(state, card, my);
  }

  /**
   * Values are substrated from 16 due to the inverted priority logic between
   * DomSim and Dominiate.
   *
   * @param {State} state
   * @param {Card} card
   * @param {Player} my
   * @returns {Number}
   */
  discardValue(state, card, my) {
    // TODO some cards have specific heuristics
    // TODO Province heuristic regarding Tournament

    if (my.actions < 1 && card.isAction()) {
      return 15;
    }

    return this.fallbackDiscardValue(state, card, my);
  }

  /**
   * This is the falback to heuristics discard evaluation.
   * Also used as trashValue function
   *
   * @param {State} state
   * @param {Card} card
   * @param {Player} my
   * @returns {Number}
   */
  fallbackDiscardValue(state, card, my) {
    if (heuristics[card].discardPriority !== undefined) {
      return 16 - heuristics[card].discardPriority;
    }

    return super.discardValue(state, card, my);
  }

  /**
   * @param {State} state
   * @param {Player} my
   * @return {boolean}
   */
  isGoingToBuyTopCardInBuyRules(state, my) {
    // we don't want to mess with a hand if we're going to buy the top card this turn (although we could)
    // @todo cannot currently model this with just dynamic priority lists
    return my.getAvailableMoney() >= 8;
  }

  getPlayStrategyFor(card) {
    let theStrategy = this.playStrategies[card];
    return theStrategy === undefined ? STRATEGY_STANDARD : theStrategy;
  }

  /**
   * @param {State} state
   * @param {Player} my
   * @return {String[]}
   */
  checkForCardToMine(state, my) {
    let upgradeChoices = cards.Mine.upgradeChoices(state, my.hand);
    return this.choose(CHOICE_UPGRADE, state, upgradeChoices);
  }

  countCardTypeInDeck(my, type) {
    const deck = my.getDeck();
    let count = 0;

    for (let card of deck) {
      // TODO take into account Estate Token to treat Estates as actions. Possibly not necessary
      // if (theCardName==DomCardName.Estate && owner.isEstateTokenPlaced() && aCardType==DomCardType.Action)
      //   theCount+= get( theCardName ).size();

      if (
        card.types.indexOf(type) > -1 ||
        (heuristics[card].types && heuristics[card].types.indexOf(type) > -1)
      ) {
        count++;
      }
    }

    return count;
  }

  /**
   * Get the amount of coins if all cards in hand were played.
   *
   * @param {Player} my
   * @return {Number}
   */
  getPotentialCoins(my) {
    let value = my.coins;

    for (let card of my.hand) {
      value += card.coins;
    }

    return value;
  }

  /**
   * @param {Player} my
   * @param {State} state
   * @param {Card} cardToTrash
   * @returns {boolean}
   */
  removingReducesBuyingPower(my, state, cardToTrash) {
    const value = this.getPotentialCoinValue(my, cardToTrash);
    const initialCoins = my.coins;
    const initialHand = my.hand.slice();
    let buyPreference;
    let reducedCoinsBuyPreference;

    if (value > 0) {
      // Check what would I buy with current money
      my.coins = this.getPotentialCoins(my);
      buyPreference = state.getSingleBuyDecision();

      // Remove card from hand and check again
      my.hand.splice(my.hand.indexOf(cardToTrash), 1);
      my.coins = initialCoins;
      my.coins = this.getPotentialCoins(my);
      reducedCoinsBuyPreference = state.getSingleBuyDecision();

      // Reset state
      my.coins = initialCoins;
      my.hand = initialHand;

      return buyPreference !== reducedCoinsBuyPreference;
    }

    return false;
  }

  /**
   * This was originally implemented in DomCard
   *
   * @see https://github.com/Geronimoo/DominionSim/blob/master/src/main/java/be/aga/dominionSimulator/DomCard.java#L143
   * @param {Player} my
   * @param {Card} card
   * @returns {number}
   */
  getPotentialCoinValue(my, card) {
    if (my.actions === 0 && card.isAction()) {
      return 0;
    }

    return card.coins;
  }

  /**
   * Counts total money in deck based on DomDeck.getTotalMoney which counts
   * terminal money as well.
   *
   * @param {Player} my
   */
  getTotalMoney(my) {
    let total = 0;

    for (let card of my.getDeck()) {
      total += card.coins;
    }

    return total;
  }
}

export const STRATEGY_STANDARD = 'standard';
export const STRATEGY_PLAY_IF_NOT_BUYING_TOP_CARD = 'playIfNotBuyingTopCard ';
export const STRATEGY_AGGRESSIVE_TRASHING = 'aggressiveTrashing';
