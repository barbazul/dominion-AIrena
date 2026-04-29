import BasicAttack from './basicAttack.js';
import { CHOICE_MINION } from '../agents/basicAI.js';

export const MINION_COINS = 'coins';
export const MINION_CARDS = 'cards';

export default class Minion extends BasicAttack {
  constructor () {
    super();
    this.cost = 5;
    this.actions = 1;
  }

  /**
   * +1 Action. Choose one: +$2; or discard your hand, +4 Cards, and each
   * other player with at least 5 cards in hand discards their hand and draws
   * 4 cards.
   *
   * @param {State} state
   */
  playEffect (state) {
    const choice = state.current.agent.choose(
      CHOICE_MINION,
      state,
      [MINION_COINS, MINION_CARDS]
    );

    if (choice === MINION_COINS) {
      state.current.coins += 2;
    } else {
      state.requireDiscard(state.current, state.current.hand.length);
      state.current.drawCards(4);
      state.attackOpponents(minionAttack);
    }
  }
}

/**
 * @param {Player} opp
 * @param {State} state
 */
export function minionAttack (opp, state) {
  if (opp.hand.length >= 5) {
    state.requireDiscard(opp, opp.hand.length);
    opp.drawCards(4);
  }
}
