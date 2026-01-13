import { DomPlayer } from './domPlayer.js';
import cards from '../../game/cards.js';

export default class BureaucratGardens extends DomPlayer {
  constructor () {
    super();
    this.name = 'Bureaucrat/Gardens';
    this.requires = [cards.Bureaucrat, cards.Gardens];
  }

  /**
   *
   * @param {State} state
   * @param {Player} my
   * @return {String[]}
   */
  gainPriority (state, my) {
    const priority = [];

    if (my.countInDeck(cards.Bureaucrat) > 4) {
      priority.push(cards.Gardens);
    }

    if (state.countInSupply(cards.Gardens) === 0) {
      priority.push(cards.Province);
      priority.push(cards.Duchy);
      priority.push(cards.Estate);
    }

    priority.push(cards.Bureaucrat);
    priority.push(cards.Silver);
    priority.push(cards.Copper);

    return priority;
  }
}
