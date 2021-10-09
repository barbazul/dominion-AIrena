import BasicAI from '../basicAI.js';

export default class DoubleMilitia extends BasicAI {
  constructor () {
    super();
    this.name = 'Double Militia';
    this.requires = ['Militia'];
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

    if (state.countInSupply('Colony') <= 6) {
      priority.push('Province');
    }

    if (state.gainsToEndGame() <= 5) {
      priority.push('Duchy');
    }

    if (my.countInDeck('Militia') < 2) {
      priority.push('Militia');
    }

    if (state.gainsToEndGame() <= 2) {
      priority.push('Estate');
    }

    priority.push('Platinum', 'Gold', 'Silver');

    if (state.gainsToEndGame() <= 3) {
      priority.push('Copper');
    }

    return priority;
  }
}
