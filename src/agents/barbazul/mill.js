import { DomPlayer } from '../domsim/domPlayer.js';
import cards from '../../game/cards.js';

export default class Mill extends DomPlayer {
  constructor () {
    super();
    this.requires = [cards.Mill];
  }

  gainPriority (state, my) {
    const priority = [];

    if (my.countInDeck(cards.Gold) > 0) {
      priority.push(cards.Province);
    }

    if (state.countInSupply(cards.Province) <= 4) {
      priority.push(cards.Duchy);
    }

    if (state.countInSupply(cards.Province) <= 4) {
      priority.push(cards.Mill);
    }

    if (state.countInSupply(cards.Province) <= 2) {
      priority.push(cards.Estate);
    }

    priority.push(cards.Gold);

    if (state.countInSupply(cards.Province) <= 6) {
      priority.push(cards.Duchy);
    }

    if (my.countInDeck(cards.Silver) >= 7) {
      priority.push(cards.Mill);
    }

    priority.push(cards.Silver);

    return priority;
  }
}
