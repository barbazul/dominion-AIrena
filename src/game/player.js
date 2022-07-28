import seedrandom from 'seedrandom';
import shuffle from '../lib/shuffle.js';
import cards from './cards.js';

export const LOCATION_DISCARD = 'discard';
export const LOCATION_HAND = 'hand';
export const LOCATION_IN_PLAY = 'inPlay';
export const LOCATION_TRASH = 'trash';

export default class Player {
  /**
   * @param {BasicAI} agent
   * @param {function(any)} log
   * @param {function():number} rng
   */
  constructor (agent, log, rng = null) {
    this.agent = agent;
    this.log = log;
    this.rng = rng || seedrandom();
    this.actions = 1;
    this.buys = 1;
    this.coins = 0;
    this.knownTopCards = 0;

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
     * To stack various card effects, we'll have to keep track of the location
     * of the card we're playing and the card we're gaining.
     *
     * @type {string}
     */
    this.playLocation = LOCATION_IN_PLAY;
    this.gainLocation = LOCATION_DISCARD;

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
   * Counts the number of cards of a given type in the deck.
   *
   * @param {String} type
   * @return {number}
   */
  countTypeInDeck (type) {
    return this.getDeck()
      .reduce(
        (count, card) => count + Number(card.types.indexOf(type) > -1),
        0
      );
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
   * The number of action cards in the player's entire deck.
   *
   * @return {number}
   */
  numActionsInDeck () {
    return this.countTypeInDeck('Action');
  }

  /**
   * A fractional value between 0.0 and 1.0, representing the proportion of
   * actions in the deck.
   *
   * @return {number}
   */
  getActionDensity () {
    return this.numActionsInDeck() / this.getDeck().length;
  }

  /**
   * A complex method meant to be used by agents in deciding wether they want
   * +actions or +cards, for example
   *
   * If the action balance is less than 0, you want +actions, because otherwise
   * you will have dead action cards in hand or risk drawing them dead. If it
   * is greater than 0, you want +cards, because you have a surplus of actions
   * and need action cards to spend them on.
   *
   * @returns {number}
   */
  actionBalance () {
    let balance = this.actions;

    this.hand.forEach(
      card => {
        if (card.isAction()) {
          balance += card.actions - 1;

          // Estimate the risk of drawing an action card dead.
          // *TODO*: do something better when there are variable card-drawers.
          /**
           * TODO I really dont like this part. If my deck consists of 10
           * Festivals and 2 Smithies, a hand of 2xSmithy, 3xFestival should
           * return a positive action balance (I would see 8 Festivals in
           * total), however current logic would return a -3:
           * +1 initial action
           * +2 2xFestivals
           * -6 2xSmithy (3 cards each with action density of 1)
           */
          if (card.actions === 0 && card.cards > 0) {
            balance -= card.cards * this.getActionDensity();
          }
        }
      }
    );

    return balance;
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
   * Counts the money the player might have upon playing all treasure in hand.
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
    const callbackfn = (accum, card) => accum + Math.max(card.actions - 1, 0);

    if (this.actions === 0) {
      return 0;
    }

    return this.actions + (this.hand.reduce(callbackfn, 0));
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

    const drawnCards = this.draw.splice(0, num);
    this.knownTopCards = Math.max(0, this.knownTopCards - drawnCards.length);

    return drawnCards;
  }

  /**
   * Shuffle the discard pile on the bottom of the draw pile
   */
  shuffle () {
    this.log(`(${this.agent.name} shuffles.)`);
    this.draw = this.draw.concat(shuffle(this.discard, this.rng));
    this.discard = [];
  }

  /**
   * Puts a card on top of draw pile.
   *
   * @param {Card[]} cards
   */
  topdeck (cards) {
    this.knownTopCards += cards.length;
    this.draw.unshift(...cards);
  }

  /**
   * Creates a copy of the state for this player
   *
   * @return {Player}
   */
  copy () {
    const newPlayer = new Player(this.agent, this.log);

    newPlayer.actions = this.actions;
    newPlayer.buys = this.buys;
    newPlayer.coins = this.coins;
    // TODO potions, coin tokens, multiplied durations
    // TODO mats
    // TODO chips

    // piles
    newPlayer.hand = this.hand.slice(0);
    newPlayer.draw = this.draw.slice(0);
    newPlayer.discard = this.discard.slice(0);
    newPlayer.inPlay = this.inPlay.slice(0);

    // TODO durations, set aside, gained this turn

    // play location, gain location
    newPlayer.playLocation = this.playLocation;
    newPlayer.gainLocation = this.gainLocation;

    // TODO action stack

    newPlayer.actionsPlayed = this.actionsPlayed;
    newPlayer.turnsTaken = this.turnsTaken;

    // TODO coin tokens spend this turn

    return newPlayer;
  }
}
