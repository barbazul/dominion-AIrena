import BasicAI from '../basicAI.js';
import cards from '../../game/cards.js';

export default class ObmBridge extends BasicAI {
  constructor() {
    super();
    this.name = 'OBM Bridge';
    this.requires = [cards.Bridge];
  }

  /**
   * Optimized version of Big Money + Bridge
   *
   * @param {State} state
   * @param {Player} my
   * @return {String[]|Card[]}
   */
  gainPriority (state, my) {
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

    if (state.gainsToEndGame() <= 6) {
      priority.push(cards.Duchy);
    }

    if (my.countInDeck(cards.Bridge) <= my.countTypeInDeck("Treasure") / 10) {
      priority.push(cards.Bridge);
    }

    if (my.countInDeck(cards.Bridge) === 0) {
      priority.push(cards.Bridge);
    }

    priority.push(cards.Silver);

    return priority;
  }
}