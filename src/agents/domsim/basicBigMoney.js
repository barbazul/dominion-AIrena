import { DomPlayer } from './domPlayer.js';
import cards from '../../game/cards.js';

export default class BasicBigMoney extends DomPlayer {
  constructor () {
    super();
    this.name = 'Basic Big Money';
  }

  gainPriority (state, my) {
    return [
      cards.Province,
      cards.Gold,
      cards.Silver
    ];
  }
}
