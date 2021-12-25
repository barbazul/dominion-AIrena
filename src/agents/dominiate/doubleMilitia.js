import BasicAI from '../basicAI.js';
import cards from '../../game/cards.js';

export default class DoubleMilitia extends BasicAI {
  constructor () {
    super();
    this.name = 'Double Militia';
    this.requires = [ cards.Militia ];
  }

  /**
   *
   * @param {State} state
   * @param {Player} my
   * @return {Card[]}
   */
  gainPriority (state, my) {
    const priority = [];

    // TODO Uncomment when Prosperity is implemented
    // if (my.countInDeck('Platinum') > 0) {
    //   priority.push('Colony');
    // }
    //
    // if (state.countInSupply('Colony') <= 6) {
      priority.push(cards.Province);
    // }

    if (state.gainsToEndGame() <= 5) {
      priority.push(cards.Duchy);
    }

    if (my.countInDeck(cards.Militia) < 2) {
      priority.push(cards.Militia);
    }

    if (state.gainsToEndGame() <= 2) {
      priority.push(cards.Estate);
    }

    // TODO Replace when Prosperity is implemented
    // priority.push('Platinum', 'Gold', 'Silver');
    priority.push(cards.Gold, cards.Silver);

    if (state.gainsToEndGame() <= 3) {
      priority.push(cards.Copper);
    }

    return priority;
  }
}
