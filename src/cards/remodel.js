import { CHOICE_UPGRADE } from '../agents/basicAI.js';
import cards from '../game/cards.js';
import BasicAction from './basicAction.js';

export default class Remodel extends BasicAction {
  constructor () {
    super();
    this.cost = 4;
    this.exactCostUpgrade = false;
    this.gainLocation = 'discard';
  }

  /**
   * Trash a card from your hand.
   * Gain a card costing up to $2 more than it.
   *
   * @param {State} state
   */
  playEffect (state) {
    const choices = this.upgradeChoices(state, state.current.hand);

    if (choices.length === 0) {
      return;
    }

    const choice = state.current.agent.choose(
      CHOICE_UPGRADE,
      state,
      choices
    );

    state.doTrash(state.current, choice.trash[0]);
    state.gainCard(state.current, choice.gain[0], this.gainLocation);
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
