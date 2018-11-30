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
    this.hand = [];
    this.discard = [
      cards.Copper, cards.Copper, cards.Copper, cards.Copper, cards.Copper, cards.Copper, cards.Copper, cards.Estate,
      cards.Estate, cards.Estate
    ];

    // index 0 is the top of the draw pile
    this.draw = [];
    this.inPlay = [];
    this.turnsTaken = 0;
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