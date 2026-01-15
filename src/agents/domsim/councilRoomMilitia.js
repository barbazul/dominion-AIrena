import { DomPlayer } from './domPlayer.js';
import cards from '../../game/cards.js';

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
      priority.push(cards.Province);
    }

    if (my.countInDeck(cards.Province) >= 1) {
      priority.push(cards.Province);
    }

    if (state.countInSupply(cards.Province) <= 4) {
      priority.push(cards.Duchy);
    }

    if (state.countInSupply(cards.Province) <= 2) {
      priority.push(cards.Estate);
    }

    if (my.countInDeck(cards.Gold) < my.countInDeck(cards['Council Room']) - 1 && this.getTotalMoney(my) < 16) {
      priority.push(cards.Gold);
    }

    if (my.countInDeck(cards['Council Room']) < 1) {
      priority.push(cards['Council Room']);
    }

    if (my.countInDeck(cards['Council Room']) < my.countInDeck(cards.Village) - 1) {
      priority.push(cards['Council Room']);
    }

    if (my.countInDeck(cards.Militia) === 0) {
      priority.push(cards.Militia);
    }

    priority.push(cards.Village);

    return priority;
  }
}
