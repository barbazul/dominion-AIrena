import BasicAction from './basicAction.js';
import cards from '../game/cards.js';

export default class Workshop extends BasicAction {
  constructor () {
    super();
    this.cost = 3;
  }

  /**
   * Gain a card costing up to (4).
   *
   * @param {State} state
   */
  playEffect (state) {
    const choices = [];

    for (const cardName of Object.keys(state.kingdom)) {
      const card = cards[cardName];

      if (state.kingdom[cardName] > 0 && card.getCost(state) <= 4) {
        choices.push(card);
      }
    }

    state.gainOneOf(state.current, choices);
  }
}
