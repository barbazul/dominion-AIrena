import { DomPlayer } from './domPlayer';
import cards from '../../game/cards';

export default class BigMoneyUltimateFor3or4 extends DomPlayer {
  constructor () {
    super();
    this.name = 'Big Money Ultimate for 3 or 4';
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

    priority.push(cards.Gold);
    priority.push(cards.Silver);

    return priority;
  }
}
