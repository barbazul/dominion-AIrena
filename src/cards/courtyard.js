import BasicAction from './basicAction.js';
import { CHOICE_TOPDECK } from '../agents/basicAI.js';

export default class Courtyard extends BasicAction {
  constructor () {
    super();
    this.cost = 2;
    this.cards = 3;
  }

  /**
   * Put a card from your hand onto your deck.
   *
   * @param {State} state
   */
  playEffect (state) {
    if (state.current.hand.length > 0) {
      const card = state.current.agent.choose(CHOICE_TOPDECK, state, state.current.hand);
      state.doTopdeck(state.current, card);
    }
  }
}
