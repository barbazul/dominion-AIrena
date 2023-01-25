import BasicAI from "../basicAI.js";
import cards from "../../game/cards.js";

export default class ObmCourtyard extends BasicAI {
  constructor () {
    super();
    this.name = 'OBM Courtyard';
    this.requires = [cards.Courtyard];
  }

  /**
   * @param {State} state
   * @param {Player} my
   * @return {String[]|Card[]}
   */
  gainPriority(state, my) {
    const priority = [];

    if (my.countInDeck(cards.Gold) > 0) {
      priority.push(cards.Province);
    }

    if (state.gainsToEndGame() <= 4) {
      priority.push(cards.Duchy);
    }

    if (state.gainsToEndGame() <= 2) {
      priority.push(cards.Estate);
    }

    priority.push(cards.Gold);

    if (state.gainsToEndGame() <= 5) {
      priority.push(cards.Duchy);
    }

    if (my.countInDeck(cards.Silver) === 0) {
      priority.push(cards.Silver);
    }

    if (my.countInDeck(cards.Courtyard) === 0) {
      priority.push(cards.Courtyard);
    }

    if (my.countInDeck(cards.Courtyard) < my.countTypeInDeck('Treasure') / 8) {
      priority.push(cards.Courtyard);
    }

    priority.push(cards.Silver);

    if (my.countInDeck(cards.Courtyard) <= 1) {
      priority.push(cards.Courtyard);
    }

    return priority;
  }
}