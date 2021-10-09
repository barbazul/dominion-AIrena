import basicAction from './basicAction.js';
import { CHOICE_PLAY } from '../agents/basicAI.js';

export default class Vassal extends basicAction {
  constructor () {
    super();
    this.cost = 3;
    this.coins = 2;
  }

  /**
   * Discard the top card of your deck. If it is an Action card, you may play it.
   * @param {State} state
   */
  playEffect (state) {
    const top = state.current.getCardsFromDeck(1);
    let card;
    let choice;

    if (top.length > 0) {
      card = top[0];
      state.current.discard.unshift(card);
      state.log(`...discarding ${card}`);

      if (card.isAction()) {
        choice = state.current.agent.choose(CHOICE_PLAY, state, [ null, card ]);

        if (choice !== null) {
          state.playAction(choice, 'discard');
        }
      }
    }
  }
}
