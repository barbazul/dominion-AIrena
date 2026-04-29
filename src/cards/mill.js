import Estate from './estate.js';

/**
 * Mill — Action/Victory card (cost: $4)
 *
 * An Action/Victory card from the Dominion: Intrigue expansion.
 * Extends Estate so it follows the same starting supply rules
 * (8 copies for 2 players, 12 for 3+) and is worth 1 VP.
 *
 * When played: +1 Card, +1 Action.
 * Then: you may discard 2 cards. If you do, +$2.
 *
 * Mill is the functional equivalent of Great Hall with an optional
 * discard-for-coins bonus, making it stronger in big-money strategies
 * once the deck has enough Silver to make the discard worthwhile.
 */
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
   *
   * The choice is binary: opt in by discarding the first card, or pass.
   * If the player discards the first card, they must discard a second
   * (or skip the bonus if the hand is now empty). Only when both discards
   * succeed does the player receive +$2.
   *
   * @param {State} state - The current game state, used to resolve
   *   the optional and required discard steps.
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
