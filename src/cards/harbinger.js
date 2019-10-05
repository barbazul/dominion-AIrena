import { CHOICE_PLAY } from '../agents/basicAI';
import BasicAction from './basicAction';

export default class Harbinger extends BasicAction {
  constructor () {
    super();
    this.cost = 3;
    this.cards = 1;
    this.actions = 1;
  }

  /**
   * Look through your discard pile. You may put a card from it onto your deck.
   *
   * @param {State} state
   */
  playEffect (state) {
    const choices = state.current.discard.slice(0);
    let chosen;

    if (choices.length > 0) {
      state.log(`${state.current.agent} looks at ${choices}`);
      choices.push(null);
      chosen = state.current.agent.choose(CHOICE_PLAY, state, choices);

      if (chosen === null) {
        return;
      }

      state.doTopdeck(state.current, chosen, 'discard');
    }
  }
}
