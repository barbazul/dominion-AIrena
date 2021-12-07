import BasicAI from '../basicAI.js';
import cards from '../../game/cards.js';

export default class BigSmithy extends BasicAI {
  constructor () {
    super();
    this.name = 'Big Smithy';
    this.requires = [cards.Smithy];
  }

  /**
   *
   * @param {State} state
   * @param {Player} my
   * @return {String[]}
   */
  gainPriority (state, my) {
    const priority = [];

    // TODO Uncomment after Colony and Platinum
    // if (my.countInDeck('Platinum') > 0) {
    //   priority.push('Colony');
    // }

    // TODO Uncomment after Colony and Platinum
    // if (state.countInSupply('Colony') <= 6 state.countInSupply(cards.Province) <= 6) {
    priority.push(cards.Province);
    //}

    if (state.gainsToEndGame() <= 5) {
      priority.push(cards.Duchy);
    }

    if (state.gainsToEndGame() <= 2) {
      priority.push(cards.Estate);
    }

    // TODO Uncomment after Colony and Platinum
    // priority.push('Platinum');
    priority.push(cards.Gold);

    if (my.countInDeck(cards.Smithy) < 2 && my.getDeck().length >= 16) {
      priority.push(cards.Smithy);
    }

    if (my.countInDeck(cards.Smithy) < 1) {
      priority.push(cards.Smithy);
    }

    priority.push(cards.Silver);

    if (state.gainsToEndGame() <= 3) {
      priority.push(cards.Copper);
    }

    return priority;
  }
}
