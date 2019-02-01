import BasicAI from '../agents/basicAI';
import cards from '../game/cards';
import BasicAction from './basicAction';

export default class Remodel extends BasicAction {
  constructor () {
    super();
    this.cost = 4;
  }

  /**
   * Trash a card from your hand.
   * Gain a card costing up to $2 more than it.
   *
   * Not using the whole upgradeFilter logic from Dominiate for now.
   *
   * @param {State} state
   */
  playEffect (state) {
    const choices = [];
    let choice;
    let used = [];

    for (let card of state.current.hand) {
      if (used.indexOf(card) === -1) {
        used.push(card);

        for (let cardName in state.kingdom) {
          if (state.kingdom.hasOwnProperty(cardName)) {
            let card2;

            if (state.countInSupply(cardName) === 0) {
              continue;
            }

            card2 = cards[cardName];

            if (card.cost + 2 >= card2.cost) {
              choices.push({ trash: [card], gain: [card2] });
            }
          }
        }
      }
    }

    choice = state.current.agent.choose(BasicAI.CHOICE_UPGRADE, state, choices);

    state.doTrash(state.current, choice.trash[0]);
    state.gainCard(state.current, choice.gain[0]);
  }
}
