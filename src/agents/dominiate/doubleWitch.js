import BasicAI from '../basicAI';

export default class DoubleWitch extends BasicAI {
  constructor () {
    super();
    this.name = 'Double Witch';
    this.requires = ['Witch'];
  }

  /**
   *
   * @param {State} state
   * @param {Player} my
   * @return {String[]}
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

    priority.push('Platinum', 'Gold', 'Silver');

    return priority;
  }
}
