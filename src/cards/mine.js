import BasicAI from '../agents/basicAI';
import Remodel from './remodel';

export default class Mine extends Remodel {
  constructor () {
    super();
    this.cost = 5;
  }

  /**
   * You may trash a Treasure from your hand. Gain a Treasure to your hand
   * costing up to $3 more than it.
   *
   * @param {State} state
   */
  playEffect (state) {
    const choice = state.current.agent.choose(
      BasicAI.CHOICE_UPGRADE,
      state,
      this.upgradeChoices(state, state.current.hand)
    );

    state.doTrash(state.current, choice.trash[0]);
    state.gainCard(state.current, choice.gain[0], 'hand');
  }

  /**
   * @param {number} coins
   * @return {number}
   */
  costFunction (coins) {
    return coins + 3;
  }

  /**
   * @param {State} state
   * @param {Card} oldCard
   * @param {Card} newCard
   * @return {boolean}
   */
  upgradeFilter (state, oldCard, newCard) {
    return super.upgradeFilter(state, oldCard, newCard) && oldCard.isTreasure() && newCard.isTreasure();
  }
}
