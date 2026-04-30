import { DomPlayer } from './domPlayer.js';
import cards from '../../game/cards.js';

export default class Minion extends DomPlayer {
  constructor () {
    super();
    this.requires = [cards.Minion];
  }

  gainPriority (state, my) {
    const priority = [];

    if (my.countInDeck(cards.Minion) > 5) {
      priority.push(cards.Province);
    }

    if (state.countInSupply(cards.Province) <= 4) {
      priority.push(cards.Duchy);
    }

    if (state.countInSupply(cards.Province) <= 2) {
      priority.push(cards.Estate);
    }

    priority.push(cards.Minion);
    priority.push(cards.Silver);

    return priority;
  }
}
