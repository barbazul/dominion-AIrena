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
    const startingCards = state.current.hand.length;
    let numDiscarded;

    state.allowDiscard(state.current, Infinity);
    numDiscarded = startingCards - state.current.hand.length;
    state.current.drawCards(numDiscarded);
  }
}
