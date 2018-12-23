import seedrandom from 'seedrandom';
import cards from './cards';
import Player from './player';

export default class State {
  constructor () {
    this.kingdom = {};
    this.specialPiles = {};
    this.players = [];
    this.trash = [];

    /**
     * @type {Player}
     */
    this.current = null;
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
    const defaults = {
      log: console.log,
      warn: msg => console.log('WARN: ' + msg),
      required: [],
      rng: seedrandom
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
    this.current = this.players[0];

    if (options.required) {
      selectedCards = selectedCards.concat(options.required);
    }

    players.forEach(agent => {
      selectedCards = selectedCards.concat(agent.requires);
    });

    this.kingdom = this.buildKingdom(selectedCards);

    return this;
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
   * The current player plays an action and performs the effects
   *
   * @param {Card} action
   * @param {String} from
   */
  playAction (action, from = 'hand') {
    let index;
    const source = this.current[from];

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
    action.playEffect(this);
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
   * Allows a player to trash up to num cards.
   * Used in optional trash effects
   * filterFunction allows to pass a filter on the allowed cards
   *
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
   * @param {function(Player, State)} effect
   */
  attackOpponents (effect) {

  }

  /**
   * Applies an attack on a player, including handling reactions
   *
   * @todo Reactions should be handled before applying attacks to any player
   * @param {Player} player
   * @param {function(Player)} effect
   */
  attackPlayer (player, effect) {

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

  }

  /**
   * Returns the number of copies of a card that remain on its pile.
   *
   * If the card is not part of the kingdom, it returns 0.
   *
   * @param {Card} card
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
}
