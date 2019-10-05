import BasicAI, { CHOICE_DISCARD } from '../agents/basicAI';
import shuffle from '../lib/shuffle';
import cards from './cards';
import Player from './player';

export const PHASE_START = 'start';
export const PHASE_ACTION = 'action';
export const PHASE_TREASURE = 'treasure';
export const PHASE_BUY = 'buy';
export const PHASE_CLEANUP = 'cleanup';

const seedrandom = require('seedrandom');

export default class State {
  constructor () {
    this.phase = PHASE_START;
    this.kingdom = {};
    this.totalCards = 0;
    this.specialPiles = {};
    this.players = [];
    this.trash = [];

    /**
     * @type {Array<function(State, Card):void>}
     */
    this.onPlayHandlers = [];

    /**
     * @type {Player}
     */
    this.current = null;

    /**
     * @type {Object}
     */
    this.cache = {};
  }

  /**
   * This method allows for the configuration of a new game.
   * Does the work of choosing a random kingdom
   *
   * config takes the following options:
   *  -
   *
   * @param {Array} players Array of player controls (Human or AI)
   * @param {Object} config configuration parameters
   */
  setUp (players, config = {}) {
    // noinspection JSPotentiallyInvalidConstructorUsage
    const defaults = {
      log: console.log,
      warn: msg => console.log('WARN: ' + msg),
      required: [],
      rng: new seedrandom() // eslint-disable-line new-cap
    };

    const options = Object.assign(defaults, config);
    let selectedCards = [];

    if (players.length < 2 || players.length > 6) {
      throw new Error('Wrong number of players.');
    }

    this.rng = options.rng;
    this.log = options.log;
    this.warn = options.warn;
    this.players = players.map(agent => new Player(agent, this.log, this.rng));
    this.players = shuffle(this.players, this.rng);
    this.current = this.players[0];

    if (options.required) {
      selectedCards = selectedCards.concat(options.required);
    }

    players.forEach(agent => {
      selectedCards = selectedCards.concat(agent.requires);
    });

    this.kingdom = this.buildKingdom(selectedCards);
    this.totalCards = this.countTotalCards();

    return this;
  }

  startGame () {
    // Draw initial hands
    this.players.forEach(p => p.drawCards(5));
  }

  /**
   * Builds the kingdom configuration for a selection of required kingdom cards and the number of players
   *
   * @param {Array} selection
   */
  buildKingdom (selection) {
    const baseCards = [cards.Curse, cards.Estate, cards.Duchy, cards.Province, cards.Copper, cards.Silver, cards.Gold];
    const kingdom = {};

    if (this.players.length === 0) {
      throw new Error('Cannot build a kingdom without players');
    }

    baseCards.forEach(card => {
      kingdom[card] = card.startingSupply(this);
    });

    selection.forEach(card => {
      card = cards[card];
      kingdom[card] = card.startingSupply(this);
    });

    return kingdom;
  }

  /**
   * List of empty supply piles
   *
   * @return {String[]}
   */
  emptyPiles () {
    const piles = [];

    for (let card in this.kingdom) {
      if (this.kingdom.hasOwnProperty(card) && this.kingdom[card] === 0) {
        piles.push(card);
      }
    }

    return piles;
  }

  /**
   * Whether the game has finished
   *
   * @return {boolean}
   */
  isGameOver () {
    // Game can only be over at the end of a turn. So we check if we are starting a new turn which is the same
    if (this.phase !== PHASE_START) {
      return false;
    }

    return this.kingdom.Province === 0 || this.emptyPiles().length >= this.totalPilesToEndGame();
  }

  /**
   * How many piles need to be empty for game to be over
   *
   * @return {int}
   */
  totalPilesToEndGame () {
    if (this.players.length > 4) {
      return 4;
    }

    return 3;
  }

  /**
   * Minimum number of buys/gains necessary to end the game.
   */
  gainsToEndGame () {
    let piles;
    let lowestPiles;
    let returnValue;

    if (this.cache.gainsToEndGame !== undefined) {
      return this.cache.gainsToEndGame;
    }

    piles = Object.values(this.kingdom);
    lowestPiles = piles.sort((a, b) => a - b).slice(0, this.totalPilesToEndGame());

    returnValue = Math.min(lowestPiles.reduce((sum, value) => sum + value, 0), this.kingdom.Province);

    this.cache.gainsToEndGame = returnValue;
    return returnValue;
  }

  /**
   * The current player plays an action and performs the effects
   *
   * @param {BasicAction} action
   * @param {String} from
   * @return void
   */
  playAction (action, from = 'hand') {
    let index;
    const source = this.current[from];

    this.log(`${this.current.agent} plays ${action}.`);

    if (source === undefined) {
      this.warn(`${this.current.agent.name} tried to play a card from invalid location ${from}`);
      return;
    }

    index = source.indexOf(action);

    if (index === -1) {
      this.warn(`${this.current.agent.name} tried to play ${action} but has none in ${from}`);
      return;
    }

    source.splice(index, 1);
    this.current.inPlay.push(action);
    this.resolveAction(action);
  }

  /**
   * Resolves the effects of playing an action.
   * Effects that cause virtual cards to be played (Throne Room, Band of
   * Misfits, etc) should call this.
   *
   * @param {BasicAction} action
   */
  resolveAction (action) {
    this.current.cardsPlayed.push(action);
    action.onPlay(this);
  }

  /**
   * The current player plays a treasure and performs its effects
   *
   * @param {Card} treasure
   * @param {String} from
   * @return void
   */
  playTreasure (treasure, from = 'hand') {
    const source = this.current[from];
    let index;

    this.log(`${this.current.agent} plays ${treasure}.`);

    if (source === undefined) {
      this.warn(`${this.current.agent.name} tried to play a card from invalid location ${from}`);
      return;
    }

    index = source.indexOf(treasure);

    if (index === -1) {
      this.warn(`${this.current.agent.name} tried to play ${treasure} but has none in ${from}`);
      return;
    }

    source.splice(index, 1);
    this.current.inPlay.push(treasure);
    treasure.onPlay(this);
  }

  /**
   * Causes a player to discard a card
   *
   * @param {Player} player
   * @param {Card} card
   * @param {String} from
   * @return {Card|void}
   */
  doDiscard (player, card, from = 'hand') {
    let index;
    const source = player[from];

    if (source === undefined) {
      this.warn(`${player.agent.name} tried to discard a card from invalid location ${from}`);
      return null;
    }

    index = source.indexOf(card);

    if (index === -1) {
      this.warn(`${player.agent.name} has no , ${card} to discard`);
      return null;
    }

    this.log(`${player.agent.name} discards ${card}.`);
    source.splice(index, 1);
    player.discard.unshift(card);
    return card;
  }

  /**
   * Put a card on top of deck
   *
   * @param {Player} player
   * @param {Card} card
   * @param {String} from
   */
  doTopdeck (player, card, from = 'hand') {
    let index;
    const source = player[from];

    if (source === undefined) {
      this.warn(`${player.agent.name} tried to topdeck a card from invalid location ${from}`);
      return;
    }

    index = source.indexOf(card);

    if (index === -1) {
      this.warn(`${player.agent.name} has no ${card} to topdeck`);
      return;
    }

    this.log(`${player.agent.name} topdecks ${card}.`);
    source.splice(index, 1);
    player.draw.unshift(card);
  }

  /**
   * Causes a player to trash a particular card
   *
   * @param {Player} player
   * @param {Card} card
   */
  doTrash (player, card) {
    const index = player.hand.indexOf(card);

    if (index === -1) {
      this.warn(`${player.agent.name} has no ${card} to trash`);
      return;
    }

    this.log(`${player.agent.name} trashes ${card}.`);
    player.hand.splice(index, 1);
    this.trash.push(card);
  }

  /**
   * Allows a player to discard up to num cards.
   * Used in discard for benefit effects
   * filterFunction allows to pass a filter on the allowed cards
   *
   * @todo Refactor all decision making methods out of state class
   * @todo This is missing context on what the benefit is so the AI is making bad decisions
   * @see https://github.com/rspeer/dominiate/issues/64
   * @param {Player} player
   * @param {int} num
   * @return {Card[]}
   */
  allowDiscard (player, num) {
    const discarded = [];

    while (discarded.length < num) {
      // in allowDiscard, valid cards are the entire hand, plus null to stop discarding
      const validDiscards = [];
      let choice;

      for (let i = 0; i < player.hand.length; i++) {
        validDiscards.push(player.hand[i]);
      }

      validDiscards.push(null);
      choice = player.agent.choose('discard', this, validDiscards);

      if (choice === null) {
        return discarded;
      }

      this.doDiscard(player, choice);
      discarded.push(choice);
    }

    return discarded;
  }

  /**
   * Requires the player to discard exactly num cards, or a many as possible
   * if there are less in hand
   *
   * @todo Refactor all decision making methods out of state class
   * @todo This is not even the right method for "discarding down to..." as cards like Diplomat may alter the number of cards after calculating
   * @param {Player} player
   * @param {number} num
   * @return {Card[]}
   */
  requireDiscard (player, num) {
    const discarded = [];
    let choice;

    while (discarded.length < num) {
      if (player.hand.length === 0) {
        return discarded;
      }

      choice = player.agent.choose(CHOICE_DISCARD, this, player.hand);
      discarded.push(choice);
      this.doDiscard(player, choice);
    }

    return discarded;
  }

  /**
   * Allows a player to trash up to num cards.
   * Used in optional trash effects
   * filterFunction allows to pass a filter on the allowed cards
   *
   * @todo Refactor all decision making methods out of state class
   * @param {Player} player
   * @param {int} num
   * @return {Card[]}
   */
  allowTrash (player, num) {
    const trashed = [];

    while (trashed.length < num) {
      const validTrashes = player.hand.slice(0);
      let choice;

      validTrashes.push(null);
      choice = player.agent.choose('trash', this, validTrashes);

      if (choice === null) {
        return trashed;
      }

      trashed.push(choice);
      this.doTrash(player, choice);
    }

    return trashed;
  }

  /**
   * gainOneOf gives the player a choice of cards to gain. Include null if gaining nothing is an option.
   *
   * @todo Refactor all decision making methods out of state class
   * @param {Player} player
   * @param {Card[]} options
   * @param {String} location
   * @return {Card|null}
   */
  gainOneOf (player, options, location = 'discard') {
    const choice = player.agent.choose('gain', this, options);

    if (choice === null) {
      return null;
    }

    this.gainCard(player, choice, location);
    return choice;
  }

  /**
   * Takes a function of one argument and applies it to all players except the current one.
   *
   * The function takes a Player to attack and alter it somehow.
   *
   * @param {function(Player, State):void} effect
   */
  attackOpponents (effect) {
    for (let opp of this.players) {
      if (opp !== this.current) {
        this.attackPlayer(opp, effect);
      }
    }
  }

  /**
   * Applies an attack on a player, including handling reactions
   *
   * @param {Player} player
   * @param {function(Player, State):void} effect
   */
  attackPlayer (player, effect) {
    /**
     * Transport event passed to each reaction function.
     * Any reaction can block the effect by setting blocked to true.
     *
     * @type {{blocked: boolean}}
     */
    const attackEvent = { blocked: false };

    // Handle reaction cards in hand
    for (let card of player.hand) {
      if (card.isReaction()) {
        card.reactToAttack(this, player, attackEvent);
      }
    }

    // Apply the attack effect unless it has been blocked by a card
    if (!attackEvent.blocked) {
      effect(player, this);
    }
  }

  /**
   * Perform the effects of a player gaining a card
   *
   * Affects a particular player and also the overall state of the game.
   *
   * @param {Player} player
   * @param {Card} card
   * @param {String} gainLocation
   */
  gainCard (player, card, gainLocation = 'discard') {
    if (this.countInSupply(card) <= 0) {
      this.log(`There is no ${card} to gain.`);
      return;
    }

    // Add to top of the list
    player[gainLocation].unshift(card);

    // Remove the card from the supply
    if (this.kingdom[card] > 0) {
      this.kingdom[card]--;
    } else {
      this.specialPiles[card]--;
    }

    this.log(`${player.agent} gains ${card}`);
  }

  /**
   * Reveal player's hand.
   *
   * Returns the list of cards in hand.
   *
   * @param {Player} player
   * @return {Card[]}
   */
  revealHand (player) {
    this.log(`${player.agent.name} reveals the hand (${player.hand})`);
  }

  /**
   * Returns the number of copies of a card that remain on its pile.
   *
   * If the card is not part of the kingdom, it returns 0.
   *
   * @param {Card|String} card
   * @return int
   */
  countInSupply (card) {
    if (this.kingdom[card]) {
      return this.kingdom[card];
    }

    if (this.specialPiles[card]) {
      return this.specialPiles[card];
    }

    return 0;
  }

  /**
   * Counts the total number of cards anywhere
   *
   * @return {Number}
   */
  countTotalCards () {
    let total = 0;

    for (const player of this.players) {
      total += player.numCardsInDeck();
    }

    for (const card in this.kingdom) {
      if (this.kingdom.hasOwnProperty(card)) {
        total += this.kingdom[card];
      }
    }

    total += this.trash.length;

    return total;
  }

  /**
   * Performs the next phase of the game.
   *
   * PHASE_START: Resolve start of turn effects
   * PHASE_ACTION: Play and resolve one or more action cards
   * PHASE_TRUEASURE: This is the first step of the buy phase where treasures are played
   * PHASE_BUY: Buy and gain cards based on the number of +buy available
   * PHASE_CLEANUP: Resolve cleanup effects, discard everything, draw new hand.
   *
   * @return void
   */
  doPhase () {
    switch (this.phase) {
      case PHASE_START:
        this.current.turnsTaken++;
        this.phase = PHASE_ACTION;
        break;

      case PHASE_ACTION:
        this.doActionPhase();
        this.phase = PHASE_TREASURE;
        break;

      case PHASE_TREASURE:
        this.doTreasurePhase();
        this.phase = PHASE_BUY;
        break;

      case PHASE_BUY:
        this.doBuyPhase();
        this.phase = PHASE_CLEANUP;
        break;

      case PHASE_CLEANUP:
        this.doCleanupPhase();
        this.rotatePlayer();
        this.phase = PHASE_START;
        break;
    }
  }

  /**
   * Perform the action phase. Ask the agent repeatedly which action to play,
   * until there are no more actions cards to play or there are no actions
   * remaining or the agent chooses to stop (null)
   */
  doActionPhase () {
    let actions;
    let choice;

    while (this.current.actions > 0) {
      actions = [null];

      for (let card of this.current.hand) {
        if (card.isAction()) {
          actions.push(card);
        }
      }

      choice = this.current.agent.choose('play', this, actions);

      if (choice === null) {
        break;
      }

      this.current.actions--;
      this.playAction(choice);
    }
  }

  /**
   * Before purchasing any cards, play any number of treasures from hand
   *
   * @todo This is not really a phase and should be included in the buy phase
   * @return void
   */
  doTreasurePhase () {
    do {
      const treasures = [];
      let choice;

      // Prepare the set of treasures that may be played.
      for (const card of this.current.hand) {
        if (card.isTreasure() && treasures.indexOf(card) === -1) {
          treasures.push(card);
        }
      }

      if (treasures.length === 0) {
        return;
      }

      // Ask the agent for a choice
      treasures.push(null);
      choice = this.current.agent.choose('play', this, treasures);

      if (choice === null) {
        return;
      }

      // Play the chosen treasure
      this.playTreasure(choice);
    } while (true);
  }

  /**
   * Determines what single card (or none) the agent wants to buy
   *
   * @return {Card}
   */
  getSingleBuyDecision () {
    const buyable = [null];

    for (const cardName in this.kingdom) {
      let card;

      if (this.kingdom.hasOwnProperty(cardName)) {
        card = cards[cardName];

        if (this.kingdom[cardName] > 0 && card.cost <= this.current.coins) {
          buyable.push(card);
        }
      }
    }

    return this.current.agent.choose('gain', this, buyable);
  }

  /**
   * Steps through the buy phase, asking the agent, to choose a card to buy
   * until it has no buys left or chooses to buy nothing.
   */
  doBuyPhase () {
    console.log(`${this.current.buys} Buys and ${this.current.coins} coins.`);
    while (this.current.buys > 0) {
      const choice = this.getSingleBuyDecision();

      if (choice === null) {
        return;
      }

      this.log(`${this.current.agent} buys ${choice}`);

      // Update money and buys
      this.current.coins -= choice.cost;
      this.current.buys--;

      // Gain the card.
      this.gainCard(this.current, choice);
    }
  }

  doCleanupPhase () {
    const totalCards = this.countTotalCards();

    // Put cards in play into discard pile (at the top)
    this.current.discard.splice(0, 0, ...this.current.inPlay.splice(0));

    // Discard cards remaining in hand
    this.current.discard.splice(0, 0, ...this.current.hand.splice(0));

    // Reset player status
    this.current.actions = 1;
    this.current.buys = 1;
    this.current.coins = 0;
    this.current.cardsPlayed = [];

    // Clean event observers
    this.onPlayHandlers = [];

    // Draw new hand
    this.current.drawCards(5);

    // Make sure we didn't drop any cards on the floor
    if (totalCards !== this.totalCards) {
      throw new Error(`The game started with ${this.totalCards}; now there are ${totalCards}`);
    }

    // Clean cache
    this.cache = {};
  }

  /**
   * The player list is implemented so that the current player is always first
   *
   * The attribute current points to the current player
   */
  rotatePlayer () {
    this.players.splice(0, 0, this.players.pop());
    this.current = this.players[0];
    this.phase = PHASE_START;
  }
}
