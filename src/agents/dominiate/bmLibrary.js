import BasicAI from '../basicAI.js';
import cards from '../../game/cards.js';

export default class BMLibrary extends BasicAI {
  constructor () {
    super();

    this.name = 'BM Library';
    this.requires = [cards.Library];
  }

  /**
   * @param {State} state
   * @param {Player} my
   * @return {String[]}
   */
  gainPriority (state, my) {
    const priority = [];
    const basePriority = [
      // TODO Pending Prosperity
      // 'Platinum',
      cards.Gold,
      cards.Library,
      cards.Silver
    ];

    // TODO Pending Prosperity
    // if (my.countInDeck('Platinum') > 0) {
    //   priority.push('colony');
    // }

    // Pending Prosperity
    // if (state.countInSupply('Colony') <= 6) {
      priority.push(cards.Province);
    // }

    if (state.gainsToEndGame() > 0 && state.gainsToEndGame() <= 5) {
      priority.push(cards.Duchy);
    }

    if (state.gainsToEndGame() > 0 && state.gainsToEndGame() <= 2) {
      priority.push(cards.Estate);
    }

    priority.push(...basePriority);

    return priority;
  }
}
