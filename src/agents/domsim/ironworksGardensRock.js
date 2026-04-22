import { DomPlayer } from './domPlayer.js';
import cards from '../../game/cards.js';

export default class IronworksGardensRock extends DomPlayer {
  constructor () {
    super();
    this.name = 'Ironworks/Gardens (Rock)';
    this.requires = [cards.Gardens, cards.Ironworks];
  }

  gainPriority (state, my) {
    const priority = [];

    if (my.countInDeck(cards.Ironworks) > 5) {
      priority.push(cards.Gardens);
    }

    if (my.countInDeck(cards.Ironworks) > 5) {
      priority.push(cards.Duchy);
    }

    priority.push(cards.Ironworks);

    if (my.countInDeck(cards.Gardens) > 0) {
      priority.push(cards.Estate);
    }

    priority.push(cards.Silver);
    priority.push(cards.Copper);

    return priority;
  }
}
