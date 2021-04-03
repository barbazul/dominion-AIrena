import { DomPlayer } from './domPlayer';
import cards from '../../game/cards';

export default class WitchAndMoatFor3or4 extends DomPlayer {
  constructor () {
    super();
    this.name = 'Witch and Moat for 3 or 4';
    this.requires = [ cards.Witch, cards.Moat ];
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

    if (my.countInDeck(cards.Witch) < 1) {
      priority.push(cards.Witch);
    }

    if (my.countInDeck(cards.Moat) === 0) {
      priority.push(cards.Moat);
    }

    priority.push(cards.Silver);

    return priority;
  }
}
