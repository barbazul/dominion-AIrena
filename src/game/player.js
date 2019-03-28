import seedrandom from 'seedrandom';
import shuffle from '../lib/shuffle';
import cards from './cards';

export default class Player {
  /**
   * @param {BasicAI} agent
   * @param {function(Any)} log
   * @param {function():number} rng
   */
  constructor (agent, log, rng = null) {
    this.agent = agent;
    this.log = log;
    this.rng = rng || seedrandom();
    this.actions = 1;
    this.buys = 1;
    this.coins = 0;

    /**
     * @type {Card[]}
     */
    this.hand = [];

    /**
     * Index 0 is the top of the discard
     *
     * @type {Card[]}
     */
    this.discard = [
      cards.Copper, cards.Copper, cards.Copper, cards.Copper, cards.Copper, cards.Copper, cards.Copper, cards.Estate,
      cards.Estate, cards.Estate
    ];

    /**
     * Index 0 is the top of the draw pile
     *
     * @type {Card[]}
     */
    this.draw = [];

    /**
     * Cards in play in the order they were played
     *
     * @type {Card[]}
     */
    this.inPlay = [];
    this.turnsTaken = 0;

    /**
     * History of cards played (also virtual cards)
     *
     * @type {Card[]}
     */
    this.cardsPlayed = [];
  }

  /**
   * Returns all cards owned by the player regardless of current location
   * (like mats or aside)
   *
   * @return {Card[]}
   */
  getDeck () {
    return [].concat(this.draw, this.discard, this.hand, this.inPlay);
  }

  /**
   * Counts the number of copies of a card in a given stack of cards.
   * @param {Card|String} card
   * @param {Card[]} stack
   * @return {number}
   */
  countInStack (card, stack) {
    let count = 0;

    for (const aCard of stack) {
      if (card.toString() === aCard.toString()) {
        count++;
      }
    }

    return count;
  }

  /**
   * Counts the number of copies of a card in the player deck.
   *
   * @param {Card|String} card
   * @return {Number}
   */
  countInDeck (card) {
    return this.countInStack(card, this.getDeck());
  }

  /**
   * Counts the number of copies of a card in hand.
   *
   * @param {Card|String} card
   * @return {number}
   */
  countInHand (card) {
    return this.countInStack(card, this.hand);
  }

  /**
   * Counts the number of copies of a card in play.
   *
   * @param {Card|String} card
   * @return {number}
   */
  countInPlay (card) {
    return this.countInStack(card, this.inPlay);
  }

  /**
   * Counts the number of times a card was played this turn.
   *
   * @param {Card|String} card
   * @return {number}
   */
  countPlayed (card) {
    return this.countInStack(card, this.cardsPlayed);
  }

  /**
   * Adds up the total money in the player's deck, including both treasure
   * simple treasures and + coin cantrips
   *
   * This is a very naive heuristic that doesn't take into account terminal
   * silvers, duration cards, coffers, or any variable coin effects.
   *
   * @return {number}
   */
  getTotalMoney () {
    let total = 0;

    for (let card of this.getDeck()) {
      if (card.isTreasure() || card.actions >= 1) {
        total += card.coins;
      }
    }

    return total;
  }

  /**
   * Counts the money the player might have upon playing all treasurein hand.
   * Banks, Ventures and such are counted inaccurately for now.
   *
   * @return {number}
   */
  getAvailableMoney () {
    return this.coins + this.getTreasureInHand();
  }

  /**
   * Adds up the value of the treasure in the player's hand. Banks, Ventures
   * and such are counted inaccurately for now.
   *
   * @todo Implement a getMoneyInHand(state) method that counts the playable action cards as well
   * @return {number}
   */
  getTreasureInHand () {
    let total = 0;

    for (let card of this.hand) {
      if (card.isTreasure()) {
        total += card.coins;
      }
    }

    return total;
  }

  /**
   * Count how many terminals will I be able to play given my current hand and
   * the floating actions available
   *
   * @return {number}
   */
  countPlayableTerminals () {
    if (this.actions === 0) {
      return 0;
    }

    return this.actions + (this.hand.reduce((accum, card) => accum + Math.max(card.actions - 1, 0), 0));
  }

  /**
   * The size of the player's deck
   *
   * @return {Number}
   */
  numCardsInDeck () {
    return this.getDeck().length;
  }

  /**
   * Draw cards from deck into hand
   *
   * @param {int} num
   * @return {Card[]}
   */
  drawCards (num) {
    const drawn = this.getCardsFromDeck(num);

    this.hand = this.hand.concat(drawn);
    this.log(`${this.agent.name} draws ${drawn.length} cards: ${drawn}.`);
    return drawn;
  }

  /**
   * Extracts a number of cards from the top of the deck shuffling as necessary.
   * The caller is responsible for movig the cards to where it corresponds or putting them back
   *
   * @param {int} num
   * @returns {Card[]}
   */
  getCardsFromDeck (num) {
    if (this.draw.length < num) {
      this.shuffle();
    }

    return this.draw.splice(0, num);
  }

  /**
   * Shuffle the discard pile on the bottom of the draw pile
   */
  shuffle () {
    this.log(`(${this.agent.name} shuffles.)`);
    this.draw = this.draw.concat(shuffle(this.discard, this.rng));
    this.discard = [];
  }
}
