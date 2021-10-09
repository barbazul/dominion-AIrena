import { DomPlayer } from './domPlayer.js';

export default class BureaucratGardens extends DomPlayer {
  constructor () {
    super();
    this.name = 'Bureaucrat/Gardens';
    this.requires = ['Bureaucrat', 'Gardens'];
  }

  /**
   *
   * @param {State} state
   * @param {Player} my
   * @return {String[]}
   */
  gainPriority (state, my) {
    const priority = [];

    if (my.countInDeck('Bureaucrat') > 4) {
      priority.push('Gardens');
    }

    if (state.countInSupply('Gardens') === 0) {
      priority.push('Province');
      priority.push('Duchy');
      priority.push('Estate');
    }

    priority.push('Bureaucrat');
    priority.push('Silver');
    priority.push('Copper');

    return priority;
  }
}
