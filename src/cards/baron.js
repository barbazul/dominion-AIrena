import BasicAction from './basicAction.js';
import { CHOICE_DISCARD } from '../agents/basicAI.js';
import cards from '../game/cards.js';

export default class Baron extends BasicAction {
  constructor () {
    super();
    this.cost = 4;
    this.buys = 1;
  }

  /**
   * You may discard an Estate for +$4. If you don't, gain an Estate.
   *
   * @param {State} state
   */
  playEffect (state) {
    let discardEstate = null;

    if (state.current.hand.indexOf(cards.Estate) > -1) {
      discardEstate = state.current.agent.choose(
        CHOICE_DISCARD,
        state,
        [ null, cards.Estate ]
      );
    }

    if (discardEstate) {
      state.doDiscard(state.current, cards.Estate);
      state.current.coins += 4;
    } else {
      state.gainCard(state.current, cards.Estate);
    }
  }
}
