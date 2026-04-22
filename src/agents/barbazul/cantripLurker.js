import BasicAI from '../basicAI.js';
import cards from '../../game/cards.js';

export default class CantripLurker extends BasicAI {
  constructor () {
    super();
    this.requires = [cards.Lurker];
  }

  /**
   * @param {State} state
   * @param {Player} my
   * @return {Card[]}
   */
  gainPriority (state, my) {
    const priority = [];

    priority.push(cards.Province);

    if (state.gainsToEndGame() <= 5) {
      priority.push(cards.Duchy);
    }

    if (state.gainsToEndGame() <= 2) {
      priority.push(cards.Estate);
    }

    priority.push(cards.Gold);

    // TODO: On a 5/2 opening, buying Lurker on $5 is suboptimal
    if (my.countInDeck(cards.Lurker) === 0) {
      priority.push(cards.Lurker);
    }

    priority.push(cards.Silver);

    return priority;
  }

  /**
   * When trashing via Lurker, uses gainValue() to evaluate the card being trashed
   * so cantrip-awareness is applied consistently.
   *
   * @param {State} state
   * @param {{ mode: string, card: Card }} choice
   * @param {Player} my
   * @return {Number}
   */
  lurkerValue (state, choice, my) {
    if (choice.mode === 'trash') {
      return this.gainValue(state, choice.card, my);
    }

    return super.lurkerValue(state, choice, my);
  }

  /**
   * Values action cards based on whether they are cantrips (actions > 0).
   * Cantrips are evaluated by cost, draw, coins, actions, and an attack bonus.
   * Terminal actions (actions = 0) are valued only by their draw.
   * Non-action cards fall back to the parent heuristic.
   *
   * @param {State} state
   * @param {Card} card
   * @param {Player} my
   * @return {Number}
   */
  gainValue (state, card, my) {
    if (!card.isAction()) {
      return super.gainValue(state, card, my);
    }

    if (card.getActions(state) > 0) {
      return card.getCost(state) + card.getCards(state) + Number(card.isAttack()) + card.coins + card.getActions(state);
    }

    return card.getCards(state);
  }
}
