import cards from '../game/cards';
import basicAction from './basicAction';

export default class Moneylender extends basicAction {
  constructor () {
    super();
    this.cost = 4;
  }

  /**
   * You may trash a Copper from yout hand for +(3).
   *
   * @param {State} state
   */
  playEffect (state) {
    let choice;

    // No effect without copper in hand
    if (state.current.hand.indexOf(cards.Copper) === -1) {
      return;
    }

    // Trashing is optional (2nd Ed.)
    choice = state.current.agent.choose('trash', state, [cards.Copper, null]);

    if (choice === null) {
      return;
    }

    state.current.coins += 3;
    state.doTrash(state.current, cards.Copper);
  }
}
