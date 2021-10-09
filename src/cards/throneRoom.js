import { CHOICE_MULTIPLY } from '../agents/basicAI.js';
import BasicAction from './basicAction.js';

export default class ThroneRoom extends BasicAction {
  constructor () {
    super();
    this.name = 'Throne Room';
    this.cost = 4;
  }

  /**
   * You may play an Action card from your hand twice
   *
   * @param {State} state
   */
  playEffect (state) {
    const choices = [];
    let choice = null;

    for (let card of state.current.hand) {
      if (card.isAction()) {
        choices.push(card);
      }
    }

    if (choices.length > 0) {
      choices.push(null);
      choice = state.current.agent.choose(CHOICE_MULTIPLY, state, choices);
    }

    if (choice) {
      // Play from hand
      state.playAction(choice);

      // Play again
      state.log(`...plays ${choice} again.`);
      state.resolveAction(choice);
    }
  }
}
