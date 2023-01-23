import { DomPlayer } from './domPlayer.js';
import cards from '../../game/cards.js';

export default class Courtyard extends DomPlayer {
  constructor () {
    super();
    this.requires = [cards.Courtyard];
  }

  gainPriority(state, my) {
    const priority = [];

    if (my.countInDeck(cards.Gold) > 0) {
      priority.push(cards.Province)
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

    if (my.countInDeck(cards.Silver) === 0) {
      priority.push(cards.Silver);
    }

    if (my.countInDeck(cards.Courtyard) < 1) {
      priority.push(Courtyard);
    }

    if (my.countInDeck(cards.Courtyard) < this.countCardTypeInDeck(my, 'Treasure') / 8) {
      priority.push(cards.Courtyard);
    }

    priority.push(cards.Silver);

    if (my.countInDeck(cards.Courtyard) < 2) {
      priority.push(cards.Courtyard);
    }

    return priority;
  }
}
