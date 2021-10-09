import BasicAI from '../basicAI.js';

export default class ChapelWitch extends BasicAI {
  constructor () {
    super();

    this.name = 'Chapel Witch';
    this.requires = ['Chapel', 'Witch'];
  }

  /**
   * @param {State} state
   * @param {Player} my
   * @return {String[]}
   */
  gainPriority (state, my) {
    const priority = [];

    if (my.countInDeck('Platinum') > 0) {
      priority.push('Colony');
    }

    if (state.countInSupply('Colony') <= 6) {
      priority.push('Province');
    }

    if (my.countInDeck('Witch') === 0) {
      priority.push('Witch');
    }

    if (state.gainsToEndGame() <= 5) {
      priority.push('Duchy');
    }

    if (state.gainsToEndGame() <= 2) {
      priority.push('Estate');
    }

    priority.push('Platinum');
    priority.push('Gold');

    // If this bot somehow gets rid of its chapel later in the game,
    // it won't try to acquire another one.
    if (my.coins <= 3 && my.countInDeck('Chapel') === 0 && my.turnsTaken <= 2) {
      priority.push('Chapel');
    }

    priority.push('Silver');

    if (state.gainsToEndGame() <= 3) {
      priority.push('Copper');
    }

    return priority;
  }

  /**
   *
   * @param {State} state
   * @param {Player} my
   * @return {String[]}
   */
  trashPriority (state, my) {
    const priority = [
      'Curse'
    ];

    if (state.gainsToEndGame() > 4) {
      priority.push('Estate');
    }

    if (my.getTotalMoney() > 4 && !(my.countInDeck('Witch'))) {
      priority.push('Copper');
    }

    if (state.gainsToEndGame() > 2) {
      priority.push('Estate');
    }

    return priority;
  }
}
