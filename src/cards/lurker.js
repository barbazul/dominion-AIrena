import BasicAction from './basicAction.js';
import { CHOICE_LURKER } from '../agents/basicAI.js';

export const LURKER_TRASH = 'trash';
export const LURKER_GAIN = 'gain';

export default class Lurker extends BasicAction {
  constructor () {
    super();
    this.cost = 2;
    this.actions = 1;
  }

  /**
   * Choose one: Trash an Action card from the Supply; or gain an Action card from the trash.
   *
   * @param {State} state
   */
  playEffect (state) {
    const choices = [
      ...this.buildTrashFromSupplyChoices(state),
      ...this.buildGainFromTrashChoices(state)
    ];

    if (choices.length === 0) {
      return;
    }

    const choice = state.current.agent.choose(CHOICE_LURKER, state, choices);

    if (!choice) {
      return;
    }

    if (choice.mode === LURKER_TRASH) {
      state.kingdom[choice.card]--;
      state.trash.push(choice.card);
      state.log(`${state.current.agent} trashes ${choice.card} from the supply.`);
    } else {
      const index = state.trash.indexOf(choice.card);

      if (index > -1) {
        state.trash.splice(index, 1);
        state.current.discard.unshift(choice.card);
        state.log(`${state.current.agent} gains ${choice.card} from the trash.`);
      }
    }
  }

  /**
   * Builds the list of Action cards in the Supply that can be trashed.
   *
   * @param {State} state
   * @return {{ mode: string, card: Card }[]}
   */
  buildTrashFromSupplyChoices (state) {
    const choices = [];

    for (const cardName of Object.keys(state.kingdom)) {
      const card = state.getCard(cardName);

      if (card && state.kingdom[cardName] > 0 && card.isAction()) {
        choices.push({ mode: LURKER_TRASH, card });
      }
    }

    return choices;
  }

  /**
   * Builds the deduplicated list of Action cards in the trash that can be gained.
   *
   * @param {State} state
   * @return {{ mode: string, card: Card }[]}
   */
  buildGainFromTrashChoices (state) {
    const choices = [];
    const seen = new Set();

    for (const card of state.trash) {
      if (card.isAction() && !seen.has(card)) {
        seen.add(card);
        choices.push({ mode: LURKER_GAIN, card });
      }
    }

    return choices;
  }
}
