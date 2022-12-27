import BasicAI from '../basicAI.js';
import cards from '../../game/cards.js';

export default class SingleBaron extends BasicAI {
  constructor() {
    super();
    this.name = 'Single Baron';
    this.requires = [ cards.Baron ];
  }

  /**
   *
   * @param {State} state
   * @param {Player} my
   * @return {String[]|Card[]}
   */
  gainPriority(state, my) {
    const priority = [];

    // TODO Uncomment after Prosperity
    // if (my.countInDeck('Platinum')) {
    //   priority.push('Colony');
    // }

    // TODO Uncomment after Prosperity
    // if (state.countInSupply('Colony') <= 6) {
    priority.push(cards.Province);
    // }

    if (state.gainsToEndGame() <= 5) {
      priority.push(cards.Duchy);
    }

    if (state.gainsToEndGame() <= 2) {
      priority.push(cards.Estate);
    }

    // TODO Uncomment after Prosperity
    // priority.push('Platinum', cards.Gold);
    priority.push(cards.Gold);

    if (my.countInDeck(cards.Baron) === 0) {
      priority.push(cards.Baron);
    }

    priority.push(cards.Silver);

    if (state.gainsToEndGame() <= 2) {
      priority.push(cards.Copper);
    }

    return priority;
  }

  discardPriority(state, my) {
    const priority = [];

    // TODO Uncomment after Prosperity
    // priority.push('Colony', cards.Province, cards.Duchy, cards.Curse);
    priority.push(cards.Province, cards.Duchy, cards.Curse);

    if (my.countInHand(cards.Baron) === 0 || my.countInHand(cards.Estate) > 1) {
      priority.push(cards.Estate);
    }

    priority.push(cards.Copper);

    if (my.countInHand(cards.Estate) === 0) {
      priority.push(cards.Baron);
    }

    priority.push(null, cards.Silver, cards.Estate, cards.Baron);

    return priority;
  }
}
