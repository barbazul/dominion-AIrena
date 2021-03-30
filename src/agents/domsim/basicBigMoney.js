import { DomPlayer } from './domPlayer';
import cards from '../../game/cards';

export default class BasicBigMoney extends DomPlayer {
  constructor () {
    super();
    this.name = 'Basic Big Money';
  }

  gainPriority(state, my) {
    return [
      cards.Province,
      cards.Gold,
      cards.Silver
    ];
  }
}
