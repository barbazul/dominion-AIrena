import BasicAction from './basicAction.js';
import cards from '../game/cards.js';

export default class Ironworks extends BasicAction {
  constructor () {
    super();
    this.cost = 4;
  }

  /**
   * Gain a card costing up to $4. If the gained card is an Action card, +1 Action;
   * a Treasure card, +$1; a Victory card, +1 Card.
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

    const gained = state.gainOneOf(state.current, choices);

    if (gained === null) {
      return;
    }

    if (gained.isAction()) {
      state.current.actions += 1;
    }

    if (gained.isTreasure()) {
      state.current.coins += 1;
    }

    if (gained.isVictory()) {
      state.current.drawCards(1);
    }
  }
}
