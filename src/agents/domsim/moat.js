import { DomPlayer } from './domPlayer.js';
import cards from '../../game/cards.js';

export default class Moat extends DomPlayer {
  constructor () {
    super();
    this.requires = [ cards.Moat ];
  }

  gainPriority (state, my) {
    const priority = [];

    if (this.getTotalMoney(my) > 16) {
      priority.push(cards.Province);
    }

    if (state.countInSupply(cards.Province) <= 4) {
      priority.push(cards.Duchy);
    }

    if (state.countInSupply(cards.Province) <= 2) {
      priority.push(cards.Estate);
    }

    priority.push(cards.Gold);

    if (state.countInSupply(cards.Province) <= 6) {
      priority.push(cards.Duchy);
    }

    if (
      this.countCardTypeInDeck(my, 'Treasure') >= 10 &&
      my.countInDeck(cards.Moat) === 0
    ) {
      priority.push(cards.Moat);
    }

    priority.push(cards.Silver);

    if (my.countInDeck(cards.Moat) < 2) {
      priority.push(cards.Moat);
    }

    return priority;
  }
}
