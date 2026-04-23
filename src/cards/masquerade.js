import { CHOICE_TRASH } from '../agents/basicAI.js';
import BasicAction from './basicAction.js';

export default class Masquerade extends BasicAction {
  constructor () {
    super();
    this.cost = 3;
    this.cards = 2;
  }

  /**
   * Each player with any cards in hand passes one to the next such player
   * to their left, at once. Then you may trash a card from your hand.
   *
   * @param {State} state
   */
  playEffect (state) {
    const activePlayers = state.players.filter(p => p.hand.length > 0);

    if (activePlayers.length > 0) {
      // Collect all choices simultaneously before any cards move
      const passing = activePlayers.map(player => ({
        player,
        card: player.agent.choose(CHOICE_TRASH, state, player.hand.slice())
      }));

      // Transfer cards in circular order: each player passes to the next
      passing.forEach(({ player, card }, i) => {
        const recipient = activePlayers[(i + 1) % activePlayers.length];
        const index = player.hand.indexOf(card);

        player.hand.splice(index, 1);
        recipient.hand.push(card);
        state.log(`${player.agent} passes ${card} to ${recipient.agent}.`);
      });
    }

    state.allowTrash(state.current, 1);
  }
}
