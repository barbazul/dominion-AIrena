import cards from '../../game/cards';
import BasicAI, { CHOICE_UPGRADE } from '../basicAI';

export class DomPlayer extends BasicAI {
  constructor () {
    super();
    this.playStrategies = {};
    this.heuristics = {
      Cellar: {
        types: ['Cycler']
      },
      Harbinger: {
        types: ['Cycler']
      },
      Laboratory: {
        types: ['Cycler', 'Card_Advantage']
      },
      Market: {
        types: ['Cycler']
      },
      Merchant: {
        types: ['Cycler']
      },
      Poacher: {
        types: ['Cycler']
      },
      Sentry: {
        types: ['Cycler']
      },
      Village: {
        types: ['Cycler', 'Village']
      }
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
   * @return {String[]}
   */
  playPriority (state, my) {
    return [
      'Festival', // 3
      'Harbinger', // 5
      'Village', // 5
      'Merchant', // 7
      'Throne Room', // 7
      'Laboratory', // 8
      'Poacher', // 10
      'Market', // 13
      'Cellar', // 16
      'Sentry', // 16
      'Witch', // 18
      'Library', // 20
      'Moneylender', // 23
      'Bandit', // 23
      'Mine', // 24
      'Remodel', // 24
      'Council Room', // 25
      'Smithy', // 25
      'Vassal', // 25
      'Bureaucrat', // 29
      'Artisan', // 30
      'Militia', // 30
      'Moat', // 33
      'Chapel', // 37
      'Workshop' // 38
    ].filter(cardName => state.kingdom[cardName] !== undefined)
      .filter(cardName => this.wantsToPlay(cardName, state, my));
  }

  /**
   *
   * @param {String} cardName
   * @param {State} state
   * @param {Player} my
   * @return {boolean}
   */
  wantsToPlay (cardName, state, my) {
    const specific = {
      Mine: (state, my) => {
        return this.checkForCardToMine(state, my) !== null;
      },
      Smithy: (state, my) => {
        if (this.getPlayStrategyFor('Smithy') === STRATEGY_PLAY_IF_NOT_BUYING_TOP_CARD &&
          this.isGoingToBuyTopCardInBuyRules(state, my)) {
          return false;
        }

        return true;
      }
    };

    if (specific[cardName]) {
      return specific[cardName](state, my);
    }

    return true;
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

  /**
   * @param {State} state
   * @param {Player} my
   * @return {String[]}
   */
  trashPriority (state, my) {
    return super.trashPriority(state, my);
  }

  countCardTypeInDeck (my, type) {
    const deck = my.getDeck();
    let count = 0;

    for (let card of deck) {
      // TODO take into account Estate Token to treat Estates as actions. Possibly not necessary
      // if (theCardName==DomCardName.Estate && owner.isEstateTokenPlaced() && aCardType==DomCardType.Action)
      //   theCount+= get( theCardName ).size();

      if (card.types.indexOf(type) > -1 || (this.heuristics[card] && this.heuristics[card].types.indexOf(type) > -1)) {
        count++;
      }
    }

    return count;
  }
}

export const STRATEGY_STANDARD = 'standard';
export const STRATEGY_PLAY_IF_NOT_BUYING_TOP_CARD = 'playIfNotBuyingTopCard ';
