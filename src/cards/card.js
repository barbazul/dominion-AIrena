
/**
 * Base card class to be extended by all other cards
 */
export default class Card {
  constructor () {
    this.name = this.constructor.name;

    // Cards may have multiple types.
    this.types = [];

    // Defines the base cost. To get the actual cost use the getCost method.
    this.cost = 0;

    // These properties are simple numeric effects for the card.
    this.actions = 0;
    this.cards = 0;
    this.coins = 0;
    this.buys = 0;
    this.vp = 0;
  }

  /**
   * Default getActions returns the value in this.actions.
   * This is meant to be an extension point for cards that change the number of
   * actions depending on the state of the game.
   *
   * @param {State} state
   * @return {number}
   */
  getActions (state) {
    return this.actions;
  }

  /**
   * Default getCards returns the value in this.cards.
   * This is meant to be an extension point for cards that change the number of
   * cards drawn depending on the state of the game.
   *
   * @param {State} state
   * @return {number}
   */
  getCards (state) {
    return this.cards;
  }

  /**
   * This method returns the number of cards in the starting supply pile for a given game
   * Usually 10 but some cards are dependant in the number of players.
   *
   * @returns {number}
   */
  startingSupply (state) {
    return 10;
  }

  /**
   * Card costs can change according to things external to the card, such as
   * bridges and quarries in play. Therefore, any code that wants to know the
   * actual cost of a card in a state should call `card.getCost(state)`.
   *
   * @todo Currently returns coin cost. Should later change to complex costs.
   * @param {State} state
   * @return int
   */
  getCost (state) {
    let cost = this.cost;

    state.costModifiers.forEach(modifier => {
      cost += modifier.modify(this);
    });

    if (cost < 0) {
      cost = 0;
    }

    return cost;
  }

  /**
   * Override this method for victory cards that need to calculate their vp value based on the state
   *
   * @param {Player} player
   * @return {number}
   */
  getVP (player) {
    return this.vp;
  }

  isAction () {
    return this.types.indexOf('Action') > -1;
  }

  isTreasure () {
    return this.types.indexOf('Treasure') > -1;
  }

  isVictory () {
    return this.types.indexOf('Victory') > -1;
  }

  isAttack () {
    return this.types.indexOf('Attack') > -1;
  }

  isReaction () {
    return this.types.indexOf('Reaction') > -1;
  }

  isCurse () {
    return this.types.indexOf('Curse') > -1;
  }

  /**
   * What happens when the card is played
   *
   * @param {State} state
   */
  playEffect (state) {

  }

  /**
   * What happens when this card is in hand and an opponent plays an attack
   *
   * @param {State} state
   * @param {Player} player
   * @param {{blocked:boolean}} attackEvent
   */
  reactToAttack (state, player, attackEvent) {

  }

  /**
   * Apply all effects of playing a card, both simple and complex effects.
   * Complex effects should override playEffect, not this.
   *
   * @const
   * @param {State} state
   */
  onPlay (state) {
    state.current.actions += this.getActions(state);
    state.current.coins += this.coins;
    state.current.buys += this.buys;

    const cardsToDraw = this.getCards(state);

    if (cardsToDraw > 0) {
      state.current.drawCards(cardsToDraw);
    }

    this.playEffect(state);

    // Trigger global onPlayHandlers
    state.onPlayHandlers.forEach(handler => {
      handler(state, this);
    });
  }

  /**
   * Making each card convert to its own name allows for the card variable to be used indistinctly in most cases
   *
   * @returns {String}
   */
  toString () {
    return this.name;
  }
}
