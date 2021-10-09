import { DomPlayer } from './domPlayer.js';

export default class CouncilRoomMilitia extends DomPlayer {
  constructor () {
    super();
    this.name = 'Council Room/Militia';
    this.requires = ['Council Room', 'Militia', 'Village'];
  }

  /**
   *
   * @param {State} state
   * @param {Player} my
   * @return {String[]}
   */
  gainPriority (state, my) {
    const priority = [];

    if (my.getAvailableMoney() >= 13) {
      priority.push('Province');
    }

    if (my.countInDeck('Province') >= 1) {
      priority.push('Province');
    }

    if (state.countInSupply('Province') <= 4) {
      priority.push('Duchy');
    }

    if (state.countInSupply('Province') <= 2) {
      priority.push('Estate');
    }

    if (my.countInDeck('Gold') < my.countInDeck('Council Room') - 1 && this.getTotalMoney(my) < 16) {
      priority.push('Gold');
    }

    if (my.countInDeck('Council Room') < 1) {
      priority.push('Council Room');
    }

    if (my.countInDeck('Council Room') < my.countInDeck('Village') - 1) {
      priority.push('Council Room');
    }

    if (my.countInDeck('Militia') === 0) {
      priority.push('Militia');
    }

    priority.push('Village');

    return priority;
  }
}
