import BasicAI from '../basicAI.js';
import cards from '../../game/cards.js';

export default class SillyAI extends BasicAI {
  gainPriority (state, my) {
    return [];
  }

  gainValue (state, card, my) {
    let val;

    if (my.turnsTaken > 100 && card !== null) {
      return 1;
    }

    if (card === cards.Copper || card === cards.Curse) {
      return -1;
    }

    return card.cost + state.rng();
  }
}
