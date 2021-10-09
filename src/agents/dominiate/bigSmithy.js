import BasicAI from '../basicAI.js';

export default class BigSmithy extends BasicAI {
  constructor () {
    super();
    this.name = 'Big Smithy';
    this.requires = ['Smithy'];
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

    if (state.countInSupply('Colony') <= 6 || state.countInSupply('Province') <= 6) {
      priority.push('Province');
    }

    if (state.gainsToEndGame() <= 5) {
      priority.push('Duchy');
    }

    if (state.gainsToEndGame() <= 2) {
      priority.push('Estate');
    }

    priority.push('Platinum', 'Gold');

    if (my.countInDeck('Smithy') < 2 && my.getDeck().length >= 16) {
      priority.push('Smithy');
    }

    if (my.countInDeck('Smithy') < 1) {
      priority.push('Smithy');
    }

    priority.push('Silver');

    if (state.gainsToEndGame() <= 3) {
      priority.push('Copper');
    }

    return priority;
  }
}
