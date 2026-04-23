import { DomPlayer } from './domPlayer.js';
import cards from '../../game/cards.js';

export default class Masquerade extends DomPlayer {
  constructor () {
    super();
    this.requires = [cards.Masquerade];
  }

  gainPriority (state, my) {
    const priority = [];

    if (my.countInDeck(cards.Gold) > 1) {
      priority.push(cards.Province);
    }

    if (state.countInSupply(cards.Province) <= 4) {
      priority.push(cards.Duchy);
    }

    if (state.countInSupply(cards.Province) <= 2) {
      priority.push(cards.Estate);
    }

    priority.push(cards.Gold);

    if (state.countInSupply(cards.Province) <= 5) {
      priority.push(cards.Duchy);
    }

    if (my.countInDeck(cards.Masquerade) < 1) {
      priority.push(cards.Masquerade);
    }

    priority.push(cards.Silver);

    return priority;
  }
}
