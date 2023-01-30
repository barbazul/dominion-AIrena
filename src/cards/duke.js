import cards from '../game/cards.js';
import Estate from './estate.js';

export default class Duke extends Estate {
  constructor () {
    super();
    this.cost = 5;
  }

  /**
   *  Worth 1 VP per Duchy you have.
   *
   * @param {Player} player
   * @return {number}
   */
  getVP (player) {
    return player.countInDeck(cards.Duchy);
  }
}
