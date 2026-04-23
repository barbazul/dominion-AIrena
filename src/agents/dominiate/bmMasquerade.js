import BasicAI from '../basicAI.js';
import cards from '../../game/cards.js';

export default class BMMasquerade extends BasicAI {
  constructor () {
    super();

    this.name = 'BM Masquerade';
    this.requires = [cards.Masquerade];
  }

  /**
   * @param {State} state
   * @param {Player} my
   * @return {Card[]}
   */
  gainPriority (state, my) {
    const priority = [];

    priority.push(cards.Province);
    priority.push(cards.Gold);

    if (state.gainsToEndGame() <= 5) {
      priority.push(cards.Duchy);
    }

    if (my.countInDeck(cards.Masquerade) === 0) {
      priority.push(cards.Masquerade);
    }

    priority.push(cards.Silver);

    return priority;
  }
}
