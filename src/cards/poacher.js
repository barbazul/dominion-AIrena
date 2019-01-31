import BasicAction from './basicAction';

export default class Poacher extends BasicAction {
  constructor () {
    super();
    this.cost = 4;
    this.actions = 1;
    this.cards = 1;
    this.coins = 1;
  }

  /**
   * Discard a card per empty supply pile.
   *
   * @param {State} state
   */
  playEffect (state) {
    state.requireDiscard(state.current, state.emptyPiles().length);
  }
}
