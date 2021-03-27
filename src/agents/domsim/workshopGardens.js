import { DomPlayer } from './domPlayer';
import cards from '../../game/cards';

export default class WorkshopGardens extends DomPlayer {
  constructor () {
    super();
    this.requires = [ cards.Gardens, cards.Workshop ];
  }

  gainPriority(state, my) {
    const priority = [
      cards.Workshop,
      cards.Estate,
      cards.Silver,
      cards.Copper
    ];

    if (my.countInDeck(cards.Workshop) > 8) {
      priority.unshift(cards.Gardens);
    }

    return priority;
  }
}
