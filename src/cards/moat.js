import basicAction from './basicAction';

export default class Moat extends basicAction {
  constructor () {
    super();
    this.cost = 2;
    this.cards = 2;
    this.types.push('Reaction');
  }

  /**
   * When another player plays an Attack card, you may first reveal this from your hand, to be unaffected by it.
   *
   * @param {State} state
   * @param {Player} player
   * @param {{blocked: boolean}} attackEvent
   * @todo As it is right now, reaction is mandatory but should be optional
   */
  reactToAttack (state, player, attackEvent) {
    // Don't bother blocking the attack if it's already blocked (avoid log spam)
    if (!attackEvent.blocked) {
      state.log(`${player.agent.name} is protected by a Moat.`);
      attackEvent.blocked = true;
    }
  }
}
