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

    for (const [ cardName, qty ] of Object.entries(state.kingdom)) {
      let card;

      // if (state.kingdom.hasOwnProperty(cardName)) {
        card = cards[cardName];

        if (card.getCost(state) <= 4) {
          choices.push(card);
        }
      // }
    }

    state.gainOneOf(state.current, choices);
  }
}
