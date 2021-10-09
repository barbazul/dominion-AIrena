import { DomPlayer } from './domPlayer.js';
import cards from '../../game/cards.js';

export default class BigMoneyUltimate extends DomPlayer {
  constructor () {
    super();
    this.name = 'Big Money Ultimate';
  }

  gainPriority (state, my) {
    const priority = [];

    if (this.getTotalMoney(my) > 18) {
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

    priority.push(cards.Silver);

    return priority;
  }
}
