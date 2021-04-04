import { DomPlayer } from './domPlayer';
import cards from '../../game/cards';

export default class Smithy extends DomPlayer {
  constructor () {
    super();
    this.requires = [ cards.Smithy ]
  }

  gainPriority(state, my) {
    const priority = [];

    if (this.getTotalMoney(my) > 15) {
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

    if (my.countInDeck(cards.Smithy) < this.countCardTypeInDeck(my, 'Treasure') / 11) {
      priority.push(cards.Smithy);
    }

    priority.push(cards.Silver);

    return priority;
  }
}