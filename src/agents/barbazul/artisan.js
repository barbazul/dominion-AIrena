import { DomPlayer } from '../domsim/domPlayer.js';
import cards from '../../game/cards.js';

export default class Artisan extends DomPlayer {
  constructor () {
    super();
    this.requires = [cards.Artisan];
  }

  gainPriority (state, my) {
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

    if (my.countInDeck(cards.Artisan) === 0) {
      priority.push(cards.Artisan);
    }

    if (my.countInDeck(cards.Artisan) < this.countCardTypeInDeck(my, 'Treasure') / 20) {
      priority.push(cards.Artisan);
    }

    priority.push(cards.Gold);

    if (state.countInSupply(cards.Province) <= 6) {
      priority.push(cards.Duchy);
    }

    priority.push(cards.Silver);

    return priority;
  }
}
