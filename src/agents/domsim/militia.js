import { DomPlayer } from './domPlayer';
import cards from '../../game/cards';

export default class Militia extends DomPlayer {
  constructor () {
    super();
    this.requires = [ cards.Militia ];
  }

  gainPriority (state, my) {
    const priority = [];

    if (my.countInDeck(cards.Gold) > 0) {
      priority.push(cards.Province);
    }

    if (state.countInSupply(cards.Province) <= 6) {
      priority.push(cards.Duchy);
    }

    if (state.countInSupply(cards.Province) <= 2) {
      priority.push(cards.Estate);
    }

    priority.push(cards.Gold);

    if (my.countInDeck(cards.Militia) < 3) {
      priority.push(cards.Militia);
    }

    priority.push(cards.Silver);

    return priority;
  }
}
