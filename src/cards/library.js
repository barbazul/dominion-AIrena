import BasicAction from './basicAction';
import { CHOICE_DISCARD } from '../agents/basicAI';

export default class Library extends BasicAction {
  constructor () {
    super();
    this.cost = 5;
  }

  /**
   * Draw until you have 7 cards in hand, skipping any Action cards you choose
   * to; set those aside, discarding them afterwards.
   *
   * @param {State} state
   */
  playEffect (state) {
    const player = state.current;
    const aside = [];

    while (player.hand.length < 7) {
      const drawn = player.getCardsFromDeck(1);
      const card = drawn[0];

      // If nothing was drawn, the deck and discard pile are empty.
      if (drawn.length === 0) {
        state.log('...stopping because there are no cards to draw.');
        break;
      }

      // Assume the times the AI wants to set the card aside are the times it
      // is on the discard priority list or has a positive discard value.
      if (card.isAction() && player.agent.choose(CHOICE_DISCARD, state, [ card, null ])) {
        state.log(`${player.agent} sets aside a ${card}.`);
        aside.push(card);
        continue;
      }

      state.log(`${player.agent} draws ${card}.`);
      player.hand.push(card);
    }

    player.discard.unshift(...aside);
  }
}
