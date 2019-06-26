import BasicAI from '../agents/basicAI';
import cards from '../game/cards';
import BasicAction from './basicAction';

export default class Remodel extends BasicAction {
  constructor () {
    super();
    this.cost = 4;
    this.exactCostUpgrade = false;
  }

  /**
   * Trash a card from your hand.
   * Gain a card costing up to $2 more than it.
   *
   * @param {State} state
   */
  playEffect (state) {
    if (state.current.hand.length === 0) {
      return;
    }

    const choice = state.current.agent.choose(
      BasicAI.CHOICE_UPGRADE,
      state,
      this.upgradeChoices(state, state.current.hand)
    );

    state.doTrash(state.current, choice.trash[0]);
    state.gainCard(state.current, choice.gain[0]);
  }

  // Auxiliary functions for remodel-like effects

  /**
   *
   * @param {State} state
   * @param {Card[]} cardList
   * @return {Array}
   */
  upgradeChoices (state, cardList) {
    const choices = [];
    let used = [];

    for (let card of cardList) {
      if (used.indexOf(card) === -1) {
        used.push(card);

        for (let cardName in state.kingdom) {
          if (state.kingdom.hasOwnProperty(cardName)) {
            let card2;

            if (state.countInSupply(cardName) === 0) {
              continue;
            }

            card2 = cards[cardName];

            if (this.upgradeFilter(state, card, card2)) {
              choices.push({ trash: [card], gain: [card2] });
            }
          }
        }
      }
    }

    return choices;
  }

  /**
   * Remodel allows up to 2 additional coins from trashed card cost
   *
   * @param {number} coins Trashed card cost in coins
   * @return {number}
   */
  costFunction (coins) {
    return coins + 2;
  }

  /**
   * Given two cards, return wether upgrading from oldCard to newCard is allowed.
   *
   * @param {State} state
   * @param {Card} oldCard
   * @param {Card} newCard
   * @return boolean
   */
  upgradeFilter (state, oldCard, newCard) {
    return this.costFunction(oldCard.cost) >= newCard.cost;
  }
}
