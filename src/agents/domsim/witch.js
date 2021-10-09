import { DomPlayer } from './domPlayer.js';
import cards from '../../game/cards.js';

export default class Witch extends DomPlayer {
  constructor () {
    super();
    this.requires = [ cards.Witch ]
  }

  gainPriority(state, my) {
    const priority = [];

    if (my.countInDeck(cards.Gold) > 0) {
      priority.push(cards.Province);
    }

    if (state.countInSupply(cards.Province) <= 5) {
      priority.push(cards.Duchy);
    }

    if (state.countInSupply(cards.Province) <= 2) {
      priority.push(cards.Estate);
    }

    if (my.countInDeck(cards.Witch) === 0) {
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
