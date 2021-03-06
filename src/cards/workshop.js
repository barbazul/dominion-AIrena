import BasicAction from './basicAction';
import cards from '../game/cards';

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

    for (let cardName in state.kingdom) {
      let card;

      if (state.kingdom.hasOwnProperty(cardName)) {
        card = cards[cardName];

        if (card.cost <= 4) {
          choices.push(card);
        }
      }
    }

    state.gainOneOf(state.current, choices);
  }
}
