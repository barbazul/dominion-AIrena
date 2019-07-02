import Remodel from './remodel';

/**
 * You may trash a Treasure from your hand. Gain a Treasure to your hand
 * costing up to $3 more than it.
 *
 * Implemented as a special case of Remodel.
 */
export default class Mine extends Remodel {
  constructor () {
    super();
    this.cost = 5;
    this.gainLocation = 'hand';
  }

  /**
   * @param {number} coins
   * @return {number}
   */
  costFunction (coins) {
    return coins + 3;
  }

  /**
   * @param {State} state
   * @param {Card} oldCard
   * @param {Card} newCard
   * @return {boolean}
   */
  upgradeFilter (state, oldCard, newCard) {
    return super.upgradeFilter(state, oldCard, newCard) && oldCard.isTreasure() && newCard.isTreasure();
  }
}
