import Estate from './estate.js';

export default class Gardens extends Estate {
  constructor () {
    super();
    this.cost = 4;
  }

  /**
   * Worth 1 vp per 10 cards you have (round down).
   *
   * @param {Player} player
   */
  getVP (player) {
    return Math.floor(player.getDeck().length / 10);
  }
}
