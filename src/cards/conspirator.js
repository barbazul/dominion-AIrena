import BasicAction from './basicAction.js';

export default class Conspirator extends BasicAction {
  constructor () {
    super();
    this.cost = 4;
    this.coins = 2;
  }

  /**
   * If you've played 3 or more Actions this turn (counting this). +1 Card and
   * +1 Action.
   *
   * @param state
   * @return {number}
   */
  getActions (state) {
    return 0;
  }
}
