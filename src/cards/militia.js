import BasicAttack from './basicAttack';

export default class Militia extends BasicAttack {
  constructor () {
    super();
    this.cost = 4;
    this.coins = 2;
  }

  /**
   * +$2 Each other player discards down to 3 cards in hand.
   *
   * @param {State} state
   */
  playEffect (state) {
    state.attackOpponents(militiaAttack);
  }
}

/**
 * @param {Player} opp
 * @param {State} state
 */
export function militiaAttack (opp, state) {
  if (opp.hand.length > 3) {
    state.requireDiscard(opp, opp.hand.length - 3);
  }
}
