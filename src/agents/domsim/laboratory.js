import { DomPlayer } from './domPlayer';
import cards from '../../game/cards';

export default class Laboratory extends DomPlayer {
  gainPriority (state, my) {
    const priority = [];

    if (my.countInDeck(cards.Gold) > 0) {
      priority.push(cards.Province);
    }

    if (state.countInSupply(cards.Province) <= 4) {
      priority.push(cards.Duchy);
    }

    if (state.countInSupply(cards.Province) <= 2) {
      priority.push(cards.Estate);
    }

    priority.push(cards.Gold);
    priority.push(cards.Laboratory);
    priority.push(cards.Silver);

    return priority;
  }
}
