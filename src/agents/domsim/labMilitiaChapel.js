import { DomPlayer, STRATEGY_AGGRESSIVE_TRASHING } from './domPlayer';
import cards from '../../game/cards';

/**
 * A Base game strategy
 *
 * Note: Removed Spy from the original strategy. I don't think it affects the
 * overall plan.
 *
 * @author Geronimoo
 */
export default class LabMilitiaChapel extends DomPlayer {
  constructor () {
    super();
    this.name = 'Lab/Militia/Chapel';
    this.requires = [ 'Festival', 'Market', 'Laboratory', 'Militia', 'Chapel' ];
    this.playStrategies.Chapel = STRATEGY_AGGRESSIVE_TRASHING;
  }

  gainPriority (state, my) {
    const priority = [];

    if (my.getAvailableMoney() >= 13) {
      priority.push(cards.Province);
    }

    if (my.countInDeck(cards.Province) >= 1) {
      priority.push(cards.Province);
    }

    if (state.countInSupply(cards.Province) <= 3) {
      priority.push(cards.Duchy);
    }

    if (state.countInSupply(cards.Province) <= 2) {
      priority.push(cards.Estate);
    }

    if (my.countInDeck(cards.Gold) === 0) {
      priority.push(cards.Gold);
    }

    if (my.countInDeck(cards.Festival) === 0) {
      priority.push(cards.Festival);
    }

    if (my.countInDeck(cards.Laboratory) > 2) {
      priority.push(cards.Market);
    }

    priority.push(cards.Laboratory);

    if (my.countInDeck(cards.Militia) === 0) {
      priority.push(cards.Militia);
    }

    if (my.countInDeck(cards.Chapel) === 0) {
      priority.push(cards.Chapel);
    }

    priority.push(cards.Silver);

    return priority;
  }
}
