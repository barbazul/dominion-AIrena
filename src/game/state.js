import seedrandom from 'seedrandom';
import cards from './cards';
import Player from './player';

export default class State {
  constructor () {
    this.kingdom = {};
    this.players = [];
    this.trash = [];
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
   * Causes a player to discard a card
   *
   * @param {Player} player
   * @param {Card} card
   */
  doDiscard (player, card) {
    const index = player.hand.indexOf(card);

    if (index === -1) {
      this.warn(`${player.agent.name} has no ${card} to discard`);
      return;
    }

    this.log(`${player.agent.name} discards ${card}.`);
    player.hand.splice(index, 1);
    player.discard.push(card);
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
}
