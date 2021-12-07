import BasicAI from '../basicAI.js';
import cards from '../../game/cards.js';

export default class ChapelWitch extends BasicAI {
  constructor () {
    super();

    this.name = 'Chapel Witch';
    this.requires = [cards.Chapel, cards.Witch];
  }

  /**
   * @param {State} state
   * @param {Player} my
   * @return {String[]}
   */
  gainPriority (state, my) {
    const priority = [];

    // TODO Uncomment after Prosperity
    // if (my.countInDeck('Platinum') > 0) {
    //   priority.push('Colony');
    // }

    // TODO Uncomment after Prosperity
    // if (state.countInSupply('Colony') <= 6) {
    priority.push(cards.Province);
    // }

    if (my.countInDeck(cards.Witch) === 0) {
      priority.push(cards.Witch);
    }

    if (state.gainsToEndGame() <= 5) {
      priority.push(cards.Duchy);
    }

    if (state.gainsToEndGame() <= 2) {
      priority.push(cards.Estate);
    }

    // TODO Uncomment after Prosperity
    // priority.push('Platinum');
    priority.push(cards.Gold);

    // If this bot somehow gets rid of its chapel later in the game,
    // it won't try to acquire another one.
    if (my.coins <= 3 && my.countInDeck(cards.Chapel) === 0 && my.turnsTaken <= 2) {
      priority.push(cards.Chapel);
    }

    priority.push(cards.Silver);

    if (state.gainsToEndGame() <= 3) {
      priority.push(cards.Copper);
    }

    return priority;
  }

  /**
   *
   * @param {State} state
   * @param {Player} my
   * @return {Card[]}
   */
  trashPriority (state, my) {
    /**
     * @type {Card[]}
     */
    const priority = [
      cards.Curse
    ];

    if (state.gainsToEndGame() > 4) {
      priority.push(cards.Estate);
    }

    if (my.getTotalMoney() > 4 && !(my.countInDeck(cards.Witch))) {
      priority.push(cards.Copper);
    }

    if (state.gainsToEndGame() > 2) {
      priority.push(cards.Estate);
    }

    return priority;
  }
}
