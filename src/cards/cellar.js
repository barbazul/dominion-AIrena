import BasicAction from './basicAction';

export default class Cellar extends BasicAction {
  constructor () {
    super();
    this.cost = 2;
    this.actions = 1;
  }

  /**
   * Discard any number of cards, then draw that many.
   *
   * @param state
   */
  playEffect (state) {
    const discarded = state.allowDiscard(state.current, Infinity);

    state.current.drawCards(discarded.length);
  }
}
