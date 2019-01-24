import BasicAction from './basicAction';

export default class Merchant extends BasicAction {
  constructor () {
    super();
    this.cost = 3;
    this.actions = 1;
    this.cards = 1;
  }

  /**
   * The first time you play a Silver this turn, +(1)
   *
   * This will set a function to be triggered whenever a card is played. This
   * is because Merchant can leave play and the effect should persist.
   *
   * @param {State} state
   */
  playEffect (state) {
    state.onPlayHandlers.push(merchantOnPlayHandler);
  }
}

/**
 * Check if the card being played is a Silver, and if it is the first one played.
 * If both conditions are true, add a coin to the player
 *
 * @param {State} state
 * @param {Card} card
 */
export function merchantOnPlayHandler (state, card) {
  // Only care about Silver
  if (card.toString() !== 'Silver') {
    return;
  }

  // If only one silver played, it is the first one
  if (state.current.countPlayed('Silver') === 1) {
    state.current.coins++;
  }
}
