import BasicAction from './basicAction.js';
import CostModifier from '../game/costModifier';

export default class Bridge extends BasicAction {
  constructor () {
    super();
    this.cost = 4;
    this.coins = 1;
    this.buys = 1;
  }

  /**
   * This turn, cards (everywhere) cost $1 less, but not less than $0.
   *
   * @param {State} state
   */
  playEffect (state) {
    state.costModifiers.push(new CostModifier(bridgeCostModifier, this));
  }
}

export function bridgeCostModifier () {
  return -1;
}
