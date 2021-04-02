import cards from '../../game/cards';
import BasicAI, { CHOICE_TRASH, CHOICE_UPGRADE } from '../basicAI';

export class DomPlayer extends BasicAI {
  constructor () {
    super();
    this.playStrategies = {};

    /**
     * This is taken from DomCardName
     *
     * @type {{{discardPriority: Number, playPriority: Number, types: String[]}}}
     */
    this.heuristics = {
      Curse: { discardPriority: 10 },
      Copper: { discardPriority: 15, playPriority: 55 },
      Silver: { discardPriority: 20, playPriority: 25 },
      Gold: { discardPriority: 24, playPriority: 30 },
      Estate: { discardPriority: 9 },
      Duchy: { discardPriority: 8 },
      Province: { discardPriority: 7 },
      Artisan: { discardPriority: 27, playPriority: 30 },
      Bandit: { discardPriority: 23, playPriority: 23 },
      Bureaucrat: { discardPriority: 20, playPriority: 29 },
      Cellar: { types: ['Cycler'], discardPriority: 17, playPriority: 16 },
      Chapel: { discardPriority: 18, playPriority: 37 },
      'Council Room': { discardPriority: 27, playPriority: 25 },
      Festival: { discardPriority: 26, playPriority: 3 },
      Gardens: { discardPriority: 9 },
      Harbinger: { types: ['Cycler'], discardPriority: 16, playPriority: 5 },
      Laboratory: { types: ['Cycler', 'Card_Advantage'], discardPriority: 40, playPriority: 8 },
      Library: { discardPriority: 30, playPriority: 20 },
      Market: { types: ['Cycler'], discardPriority: 30, playPriority: 13 },
      Merchant: { types: ['Cycler'], discardPriority: 19, playPriority: 7 },
      Militia: { discardPriority: 25, playPriority: 30 },
      Mine: { discardPriority: 22, playPriority: 24 },
      Moat: { discardPriority: 23, playPriority: 33 },
      Moneylender: { discardPriority: 21, playPriority: 23 },
      Poacher: { types: ['Cycler'], discardPriority: 30, playPriority: 10 },
      Remodel: { discardPriority: 18, playPriority: 24 },
      Sentry: { types: ['Cycler'], discardPriority: 22, playPriority: 16 },
      Smithy: { discardPriority: 24, playPriority: 25 },
      'Throne Room': { discardPriority: 22, playPriority: 7 },
      Vassal: { discardPriority: 23, playPriority: 25 },
      Village: { types: ['Cycler', 'Village'], discardPriority: 21, playPriority: 5 },
      Witch: { discardPriority: 40, playPriority: 18 },
      Workshop: { discardPriority: 22, playPriority: 38 }
    };
  }

  /**
   *
   * @param {Player} my
   * @return {number}
   */
  countTerminalsInDeck (my) {
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
  playPriority (state, my) {
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
   * @param state
   * @param card
   * @param my
   * @returns {Number|*}
   */
  playValue(state, card, my) {
    if (this.heuristics[card].playPriority !== undefined) {
      return 100 - this.heuristics[card].playPriority;
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
  wantsToPlay (cardName, state, my) {
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
          my.getTotalMoney() - this.getPotentialCoinValue(my, cardToTrash) < minMoneyInDeck
          && my.getTotalMoney() >= minMoneyInDeck;


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
  trashValue (state, card, my) {
    return this.fallbackDiscardValue(state, card, my);
  }

  /**
   * Values are substrated from 100 due to the inverted priority logic between
   * DomSim and Dominiate.
   *
   * @param {State} state
   * @param {Card} card
   * @param {Player} my
   * @returns {Number}
   */
  discardValue(state, card, my) {
    if (my.actions < 1 && card.isAction()) {
      return 16;
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
  fallbackDiscardValue (state, card, my) {
    if (this.heuristics[card].discardPriority !== undefined) {
      return 16 - this.heuristics[card].discardPriority;
    }

    return super.discardValue(state, card, my);
  }

  /**
   * @param {State} state
   * @param {Player} my
   * @return {boolean}
   */
  isGoingToBuyTopCardInBuyRules (state, my) {
    // we don't want to mess with a hand if we're going to buy the top card this turn (although we could)
    // @todo cannot currently model this with just dynamic priority lists
    return my.getAvailableMoney() >= 8;
  }

  getPlayStrategyFor (card) {
    let theStrategy = this.playStrategies[card];

    if (card.toString() === 'Madman') {
      theStrategy = this.playStrategies['Hermit'];
    }

    return theStrategy === undefined ? STRATEGY_STANDARD : theStrategy;
  }

  /**
   * @param {State} state
   * @param {Player} my
   * @return {String[]}
   */
  checkForCardToMine (state, my) {
    let upgradeChoices = cards.Mine.upgradeChoices(state, my.hand);
    return this.choose(CHOICE_UPGRADE, state, upgradeChoices);
  }

  countCardTypeInDeck (my, type) {
    const deck = my.getDeck();
    let count = 0;

    for (let card of deck) {
      // TODO take into account Estate Token to treat Estates as actions. Possibly not necessary
      // if (theCardName==DomCardName.Estate && owner.isEstateTokenPlaced() && aCardType==DomCardType.Action)
      //   theCount+= get( theCardName ).size();

      if (
        card.types.indexOf(type) > -1 ||
        (this.heuristics[card].types && this.heuristics[card].types.indexOf(type) > -1)
      ) {
        count++;
      }
    }

    return count;
  }

  /**
   * @param {Player} my
   * @param {State} state
   * @param {Card} cardToTrash
   * @returns {boolean}
   */
  removingReducesBuyingPower(my, state, cardToTrash) {
    const value = this.getPotentialCoinValue(my, cardToTrash);

    if (value > 0) {
      const buyPreference = state.getSingleBuyDecision();
      const index = my.hand.indexOf(cardToTrash);
      my.hand.splice(index, 1);
      const reducedCoinsBuyPreference = state.getSingleBuyDecision();
      my.hand.push(cardToTrash);

      return buyPreference !== reducedCoinsBuyPreference;
    }

    return false;
  }

  /**
   * @param {Player} my
   * @param {Card} card
   * @returns {number}
   */
  getPotentialCoinValue(my, card) {
    if (my.actions === 0 && card.isAction() && my.hand.indexOf(card) > -1) {
      return 0;
    }

    return card.coins;
  }
}

export const STRATEGY_STANDARD = 'standard';
export const STRATEGY_PLAY_IF_NOT_BUYING_TOP_CARD = 'playIfNotBuyingTopCard ';
export const STRATEGY_AGGRESSIVE_TRASHING = 'aggressiveTrashing';
