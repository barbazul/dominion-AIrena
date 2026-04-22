import { DomPlayer } from './domPlayer.js';
import cards from '../../game/cards.js';

export default class IronworksGardensScissors extends DomPlayer {
  constructor () {
    super();
    this.name = 'Ironworks/Gardens (Scissors)';
    this.requires = [cards.Gardens, cards.Ironworks];
  }

  gainPriority (state, my) {
    const priority = [];

    priority.push(cards.Province);

    if (my.countInDeck(cards.Silver) > 2) {
      priority.push(cards.Duchy);
    }

    if (my.countInDeck(cards.Silver) > 2) {
      priority.push(cards.Gardens);
    }

    priority.push(cards.Gold);

    if (my.countInDeck(cards.Ironworks) < 2) {
      priority.push(cards.Ironworks);
    }

    if (my.countInDeck(cards.Silver) > 5) {
      priority.push(cards.Estate);
    }

    priority.push(cards.Silver);
    priority.push(cards.Copper);

    return priority;
  }
}
