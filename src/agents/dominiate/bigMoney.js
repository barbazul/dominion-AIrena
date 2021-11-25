import BasicAI from '../basicAI.js';
import cards from '../../game/cards.js';

/**
 * This is an implementation of the pure Big Money strategy, updated
 * based on WanderingWinder's forum posts:
 * http://forum.dominionstrategy.com/index.php?topic=625
 *
 * @author WanderingWinder
 */
export default class BigMoney extends BasicAI {
  /**
   * @param {State} state
   * @param {Player} my
   * @return {String[]}
   */
  gainPriority (state, my) {
    const priority = [];

    // TODO Uncomment when we have Colonies implemented
    // if (state.kingdom.Colony) {
    //   return this.colonyBoardPriority(state, my);
    // }

    if (my.getTotalMoney() > 18) {
      priority.push(cards.Province);
    }

    if (state.gainsToEndGame() <= 4) {
      priority.push(cards.Duchy);
    }

    if (state.gainsToEndGame() <= 2) {
      priority.push(cards.Estate);
    }

    priority.push(cards.Gold);

    if (state.gainsToEndGame() <= 6) {
      priority.push(cards.Duchy);
    }

    priority.push(cards.Silver);

    return priority;
  }

  colonyBoardPriority (state, my) {
    const priority = [];

    if (my.getTotalMoney() > 32) {
      priority.push('Colony');
    }

    if (state.gainsToEndGame() <= 6) {
      priority.push('Province');
    }

    if (state.gainsToEndGame() <= 5) {
      priority.push('Duchy');
    }

    if (state.gainsToEndGame() <= 2) {
      priority.push('Estate');
    }

    priority.push('Platinum');

    if (state.countInSupply('Colony') <= 7) {
      priority.push('Province');
    }

    priority.push('Gold');

    if (state.gainsToEndGame() <= 6) {
      priority.push('Duchy');
    }

    priority.push('Silver');

    if (state.gainsToEndGame() <= 2) {
      priority.push('Copper');
    }

    return priority;
  }
}
