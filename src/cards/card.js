
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
   * This method returns the number of cards in the starting supply pile for a given game
   * Usually 10 but some cards are dependant in the number of players.
   *
   * @returns {number}
   */
  startingSupply (state) {
    return 10;
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
   * Making each card convert to its own name allows for the card variable to be used indistinctly in most cases
   *
   * @returns {String}
   */
  toString () {
    return this.name;
  }
}
