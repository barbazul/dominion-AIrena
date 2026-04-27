import Estate from './estate.js';

export default class Mill extends Estate {
  constructor () {
    super();
    this.cost = 4;
    this.cards = 1;
    this.actions = 1;
    this.types = ['Action', 'Victory'];
  }

  /**
   * You may discard 2 cards. If you do, +$2.
   * The choice is binary: commit to discarding 2 cards (or 1 if hand runs out), or discard nothing.
   *
   * @param {State} state
   */
  playEffect (state) {
    const firstDiscard = state.allowDiscard(state.current, 1);

    if (firstDiscard.length === 1) {
      const secondDiscard = state.requireDiscard(state.current, 1);

      if (secondDiscard.length === 1) {
        state.current.coins += 2;
      }
    }
  }
}
