import { DomPlayer } from './domPlayer';
import cards from '../../game/cards';

export default class Festival extends DomPlayer {
  constructor () {
    super();
    this.name = 'Festival';
    this.requires = [ cards.Festival ];
  }

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

    if (state.countInSupply(cards.Province) <= 6) {
      priority.push(cards.Duchy);
    }

    priority.push(cards.Festival);
    priority.push(cards.Silver);

    return priority;
  }
}
