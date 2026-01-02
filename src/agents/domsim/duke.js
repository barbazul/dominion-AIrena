import { DomPlayer } from './domPlayer.js';
import cards from '../../game/cards.js';

export default class Duke extends DomPlayer {
  gainPriority(state, my) {
    const priority = [];

    if (my.getTotalMoney() >= 14) {
      priority.push(cards.Duchy);
    }

    if (state.countInSupply(cards.Duchy) === 0 && my.countInDeck(cards.Duchy) < 7) {
      priority.push(cards.Province);
    }

    if (state.countInSupply(cards.Duchy) === 0) {
      priority.push(cards.Duke);
    }

    state.log("Dukes in supply: " + state.countInSupply(cards.Duke));
    if (state.countInSupply(cards.Duke) <= 3) {
      priority.push(cards.Estate);
    }

    priority.push(cards.Gold, cards.Silver, cards.Copper);

    return priority;
  }
}