import cards from '../game/cards';
import BasicAttack from './basicAttack';

export default class Witch extends BasicAttack {
  constructor () {
    super();
    this.cost = 5;
    this.cards = 2;
  }

  /**
   * Each other player gains a Curse.
   *
   * @param state
   */
  playEffect (state) {
    state.attackOpponents(this.witchAttack);
  }

  /**
   * @param {Player} opp
   * @param {State} state
   */
  witchAttack (opp, state) {
    state.gainCard(opp, cards.Curse);
  }
}
