import BasicAI from '../basicAI';

export default class SillyAI extends BasicAI {
  gainPriority (state, my) {
    return [];
  }

  gainValue (state, card, my) {
    let val;

    // Decided to change calculation so it's lets scripted to "get the most expensive card"
    // Still prefers expensive cards this way
    if (my.turnsTaken > 20 && !!card) {
      return card.cost;
    }

    if (card.toString() === 'Copper' || card.toString() === 'Curse') {
      return -1;
    }

    val = state.rng() - 0.05;

    if (val < 0) {
      return val;
    }

    return card.cost * Math.sqrt(val);
  }
}
