import BasicAI from '../basicAI.js';

export default class MoneylenderWitch extends BasicAI {
  constructor () {
    super();
    this.name = 'Moneylender Witch';
    this.requires = ['Moneylender', 'Witch'];
  }

  /**
   *
   * @param {State} state
   * @param {Player} my
   * @returns {String[]}
   */
  gainPriority (state, my) {
    const priority = [];

    if (my.countInDeck('Platinum') > 0) {
      priority.push('Colony');
    }

    if (state.countInSupply('Colony') <= 6 && my.countInDeck('Gold') > 0) {
      priority.push('Province');
    }

    if (my.countInDeck('Witch') < 2) {
      priority.push('Witch');
    }

    if (state.gainsToEndGame() <= 5) {
      priority.push('Duchy');
    }

    if (state.gainsToEndGame() <= 2) {
      priority.push('Estate');
    }

    priority.push('Platinum', 'Gold');

    if (my.countInDeck('Moneylender') === 0) {
      priority.push('Moneylender');
    }

    priority.push('Silver');

    return priority;
  }
}
