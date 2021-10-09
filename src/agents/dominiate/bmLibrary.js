import BasicAI from '../basicAI.js';

export default class BMLibrary extends BasicAI {
  constructor () {
    super();

    this.name = 'BM Library';
    this.requires = ['Library'];
  }

  /**
   * @param {State} state
   * @param {Player} my
   * @return {String[]}
   */
  gainPriority (state, my) {
    const priority = [];
    const basePriority = [
      'Platinum',
      'Gold',
      'Library',
      'Silver'
    ];

    if (my.countInDeck('Platinum') > 0) {
      priority.push('colony');
    }

    if (state.countInSupply('Colony') <= 6) {
      priority.push('Province');
    }

    if (state.gainsToEndGame() > 0 && state.gainsToEndGame() <= 5) {
      priority.push('Duchy');
    }

    if (state.gainsToEndGame() > 0 && state.gainsToEndGame() <= 2) {
      priority.push('Estate');
    }

    priority.push(...basePriority);

    return priority;
  }
}
