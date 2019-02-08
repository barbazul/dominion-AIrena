import BasicAction from './basicAction';

export default class CouncilRoom extends BasicAction {
  constructor () {
    super();
    this.name = 'Council Room';
    this.cost = 5;
    this.cards = 4;
    this.buys = 1;
  }

  /**
   * Each other player draws a card.
   *
   * @param {State} state
   */
  playEffect (state) {
    for (let opp of state.players) {
      if (opp !== state.current) {
        opp.drawCards(1);
      }
    }
  }
}
