import { DomPlayer } from './domPlayer.js';
import cards from '../../game/cards.js';

export default class DoubleMoatFor3or4 extends DomPlayer {
  constructor () {
    super();
    this.name = 'Double Moat for 3 or 4';
    this.requires = [ cards.Moat ];
  }

  gainPriority (state, my) {
    const priority = [];

    if (my.countInDeck(cards.Gold) > 0) {
      priority.push(cards.Province);
    }

    if (state.gainsToEndGame() <= 7) {
      priority.push(cards.Duchy);
    }

    if (state.gainsToEndGame() <= 3) {
      priority.push(cards.Estate);
    }

    priority.push(cards.Gold);

    if (my.countInDeck(cards.Silver) === 0) {
      priority.push(cards.Silver);
    }

    if (my.countInDeck(cards.Moat) < 2) {
      priority.push(cards.Moat);
    }

    priority.push(cards.Silver);

    return priority;
  }
}
