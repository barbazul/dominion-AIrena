import basicAction from './basicAction.js';

export default class Chapel extends basicAction {
  constructor () {
    super();
    this.cost = 2;
  }

  /**
   * Trash up to 4 cards from your hand
   *
   * @param {State} state
   */
  playEffect (state) {
    state.allowTrash(state.current, 4);
  }
}
