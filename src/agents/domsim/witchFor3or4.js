import { DomPlayer } from './domPlayer.js';
import cards from '../../game/cards.js';

export default class WitchFor3or4 extends DomPlayer {
  constructor () {
    super();
    this.name = 'Witch for 3 or 4';
    this.requires = [ cards.Witch ];
  }

  gainPriority(state, my) {
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

    if (my.countInDeck(cards.Witch) < 1) {
      priority.push(cards.Witch);
    }

    priority.push(cards.Gold);

    if (my.countInDeck(cards.Witch) < 2) {
      priority.push(cards.Witch);
    }

    priority.push(cards.Silver);
    return priority;
  }
}
