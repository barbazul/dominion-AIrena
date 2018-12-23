import cards from '../game/cards';
import BasicAttack from './basicAttack';

export default class Bureaucrat extends BasicAttack {
  constructor () {
    super();
    this.cost = 4;
  }

  /**
   * Gain a Silver onto your deck. Each other player reveals a Victory card
   * from their hand and puts it onto their deck (or reveals a hand with no
   * Victory cards).
   *
   * @param {State} state
   */
  playEffect (state) {
    state.gainCard(state.current, cards.Silver, 'draw');
    state.attackOpponents(this.bureaucratAttack);
  }

  /**
   *
   * @param {Player} opp
   * @param {State} state
   */
  bureaucratAttack (opp, state) {
    const victoryCards = [];
    let choice;

    for (let card of opp.hand) {
      if (card.isVictory()) {
        victoryCards.push(card);
      }
    }

    if (victoryCards.length === 0) {
      state.revealHand(opp);
      return;
    }

    choice = opp.agent.choose('topdeck', state, victoryCards);
    state.doTopdeck(opp, choice);
  }
}
