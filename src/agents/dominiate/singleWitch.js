import BasicAI from '../basicAI.js';
import cards from "../../game/cards.js";

export default class SingleWitch extends BasicAI {
  constructor () {
    super();
    this.name = 'Single Witch';
    this.requires = [cards.Witch];
  }

  /**
   *
   * @param {State} state
   * @param {Player} my
   * @returns {String[]}
   */
  gainPriority (state, my) {
    const priority = [];

    // TODO Uncomment after Prosperity
    // if (my.countInDeck('Platinum') > 0) {
    //   priority.push('Colony');
    // }

    if (/*state.countInSupply('Colony') <= 6 &&*/ my.countInDeck(cards.Gold) > 0) {
      priority.push(cards.Province);
    }

    if (my.countInDeck(cards.Witch) === 0) {
      priority.push(cards.Witch);
    }

    if (state.gainsToEndGame() <= 5) {
      priority.push(cards.Duchy);
    }

    if (state.gainsToEndGame() <= 2) {
      priority.push(cards.Estate);
    }

    priority.push(/*'Platinum',*/ cards.Gold, cards.Silver);

    return priority;
  }
}
