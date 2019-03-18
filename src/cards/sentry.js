import BasicAI from '../agents/basicAI';
import BasicAction from './basicAction';

export default class Sentry extends BasicAction {
  constructor () {
    super();
    this.cost = 5;
    this.actions = 1;
    this.cards = 1;
  }

  /**
   * Look at the top 2 cards of your deck. Trash and/or discard any number of
   * them. Put the rest back on top in any order.
   *
   * @param {State} state
   */
  playEffect (state) {
    const lookingAt = state.current.getCardsFromDeck(2);
    const remainder = [];
    const toTopdeck = [];
    let choice;

    state.log(`${state.current.agent} looks at ${lookingAt}`);

    // Choose what to trash
    lookingAt.forEach(card => {
      choice = state.current.agent.choose(BasicAI.CHOICE_TRASH, state, [card, null]);

      if (choice !== null) {
        state.trash.push(choice);
        state.log(`${state.current.agent} trashes ${choice}`);
      } else {
        remainder.push(card);
      }
    });

    // Choose what to discard
    remainder.forEach(card => {
      choice = state.current.agent.choose(BasicAI.CHOICE_DISCARD, state, [card, null]);

      if (choice !== null) {
        state.current.discard.unshift(choice);
        state.log(`${state.current.agent} discards ${choice}`);
      } else {
        toTopdeck.push(card);
      }
    });

    // Topdecks remaining cards
    state.current.draw.unshift(...toTopdeck);
  }
}
