import { DomPlayer } from './domPlayer';
import cards from '../../game/cards';

export default class CouncilRoom extends DomPlayer {
  constructor () {
    super();
    this.name = 'Council Room';
    this.requires = [ cards['Council Room'] ];
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

    if (my.countInDeck(cards['Council Room']) === 0 / 8) { // extra_operation divideBy 8 ?
      priority.push(cards['Council Room']);
    }

    if (my.countInDeck(cards['Council Room']) < this.getTotalMoney(my) / 13) {
      priority.push(cards['Council Room']);
    }

    priority.push(cards.Silver);

    return priority;
  }
}
