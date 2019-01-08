import cards from '../game/cards';

/**
 * This defines the base for an AI agent.
 * All AI agents should extend this.
 * It implements the base decision making machinery as well as several heuristic based decitions
 */
export default class BasicAI {
  constructor () {
    this.requires = [];
    this.name = this.constructor.name;
  }

  toString () {
    return this.name;
  }

  /**
   * Returns the Player state object associated to the AI making the choice.
   * state.current cannot be used since some decisions are made on other players turns
   *
   * @param state
   */
  myPlayer (state) {
    let found = -1;

    for (let i = 0; i < state.players.length; i++) {
      if (state.players[i].agent === this) {
        found = i;
        break;
      }
    }

    if (found < 0) {
      throw new Error(this.name + ' is being asked a decision but is not playing');
    }

    return state.players[found];
  }

  /**
   * This is the general case decision entry point.
   * For each type of decision there are up to 2 specific decision implementations.
   *
   * The first is a priority list, which returns the order in which to prefer the choices if available.
   * In this case, null represents explicitly 'no choice', when this is a legal option.
   *
   * The second one receives each individual choice and returns a numerical value for it. Null is only 0, so negative
   * values means 'avoid this choice, unless forced to'
   *
   * @param {String} type
   * @param {State} state
   * @param {Array} choices
   * @todo Replace choices array for some wrapper class which would contain logic regarding the structure of its choices
   * @todo Extract the whole *Func logic
   */
  choose (type, state, choices) {
    const my = this.myPlayer(state);
    const flatChoices = choices.map(choice => choice === null ? null : choice.toString());
    let priority;
    let priorityFunc;
    let bestChoice = null;
    let bestValue = -Infinity;

    // No real choice
    if (choices.length === 1) {
      return choices[0];
    }

    // When there are no choices we follow the rule that makes the null choice available in that situation.
    if (choices.length === 0) {
      return null;
    }

    // Check the priority list
    priorityFunc = this.getPriorityFunction(type);

    if (priorityFunc) {
      priority = priorityFunc.call(this, state, my);

      for (let i = 0; i < priority.length; i++) {
        const preference = priority[i];
        const index = flatChoices.indexOf(preference);

        if (index > -1) {
          return choices[index];
        }
      }
    }

    // The priority list does not want any of the choices (or there  is no priority list)
    // Evaluate each option to choose best
    for (let i = 0; i < choices.length; i++) {
      const value = this.getChoiceValue(type, state, choices[i], my);

      if (value > bestValue) {
        bestValue = value;
        bestChoice = choices[i];
      }
    }

    if (bestChoice !== null) {
      return bestChoice;
    }

    throw new Error(`${this.name} somehow failed to make a choice`);
  }

  /**
   * Get a priority list generator function for the type of decision if available
   *
   * @param {String} type
   * @returns {function(State, Player):String[]}
   */
  getPriorityFunction (type) {
    const priorityFunc = this[type + 'Priority'];

    if (priorityFunc) {
      return priorityFunc;
    }

    return null;
  }

  /**
   * Assigns a numerical value to a single choice
   *
   * @param {String} type
   * @param {State} state
   * @param {*} choice
   * @param {Player} my
   * @returns {number}
   */
  getChoiceValue (type, state, choice, my) {
    let specificFunction;

    if (choice === null) {
      return 0;
    }

    specificFunction = this.getValueFunction(type);

    if (specificFunction) {
      const result = specificFunction.call(this, state, choice, my);

      if (result !== null) {
        return result;
      }
    }

    // Skipping Dominiate default value function because I dont want to put hard heuristics in cards for now

    state.warn(`${this.name} doesn't know how to make a ${type} decision for ${choice}`);

    return -1000;
  }

  /**
   * Get a choice evaluator function for the type of decision if available
   *
   * @param {String} type
   * @return {Function}
   */
  getValueFunction (type) {
    const valueFunc = this[type + 'Value'];

    if (valueFunc) {
      return valueFunc;
    }

    return null;
  }

  /**
   * The default buying strategy is a form of Big Money.
   *
   * @param {State} state
   * @param {Player} my
   * @return {String[]}
   */
  gainPriority (state, my) {
    const priority = [];
    const basePriority = [
      'Platinum',
      'Gold',
      'Silver'
    ];

    if (my.countInDeck('Platinum') > 0) {
      priority.push('Colony');
    }

    if (state.countInSupply('Colony') <= 6) {
      priority.push('Province');
    }

    if (state.gainsToEndGame() <= 5) {
      priority.push('Duchy');
    }

    if (state.gainsToEndGame() <= 2) {
      priority.push('Estate');
    }

    priority.splice(priority.length, 0, ...basePriority);

    if (state.gainsToEndGame() <= 3) {
      priority.push('Copper');
    }

    return priority;
  }

  /**
   * Default is to favor more expensive cards, particularly actions and treasures.
   * Values are negative to prefer skipping gain when not on priority list and
   * only gaining when forced to.
   *
   * @param {State} state
   * @param {Card} card
   * @param {Player} my
   * @return {Number}
   */
  gainValue (state, card, my) {
    return card.cost + (card.isTreasure() ? 1 : 0) + (card.isAction() ? 1 : 0) - 20;
  }

  /**
   * Heuristic discard priority .
   *
   * The default `discardPriority` is tuned for Big Money where the decisions
   * are obvious. But many strategies would probably prefer a different
   * priority list, especially one that knows about action cards.
   *
   * It doesn't understand
   * discarding cards to make Shanty Town or Menagerie work, for example.
   *
   * @param {State} state
   * @param {Player} my
   * @return {String[]} array
   */
  discardPriority (state, my) {
    return [
      'Tunnel',
      'Vineyard',
      'Colony',
      'Duke',
      'Duchy',
      'Fairgrounds',
      'Gardens',
      'Province',
      'Curse',
      'Estate'
    ];
  }

  /**
   * Heuristic discard value.
   *
   * Evaluates whether it has excess actions and prioritizes actions if so.
   * Otherwise discards the cheapest cards. Victory cards would already been
   * discarded by discardPriority unless customized.
   *
   * @param {State} state
   * @param {Card} card
   * @param {Player} my
   * @return {Number}
   */
  discardValue (state, card, my) {
    if (card.isAction() && my.actions === 0) {
      return 20 - card.cost;
    }

    return 0 - card.cost;
  }

  /**
   * Heuristic play value.
   *
   * This is a migration of Dominiate ai_playValue function in each card.
   *
   * @todo Numbers seem arbitrary. See if there is a way to turn them into a logic function
   * @param {State} state
   * @param {Card} card
   * @param {Player} my
   * @return {Number}
   */
  playValue (state, card, my) {
    const playValues = {
      'Advisor': 1000,
      'Adventurer': 176,
      'Alchemist': 785,
      // 'Ambassador': my.actions > 0 && wantsToTrash > 0 ? 1100 : -1
      'Apothecary': 880,
      'Apprentice': 730,
      'Bag of Gold': 885,
      'Bandit Camp': 821,
      'Baker': 774,
      'Bank': 20,
      // 'Baron': my.hand.indexOf(cards.Estate) > -1 ? 184 : (this.cardInDeckValue(state, cards.Estate, my) ? 5 : -5),
      'Bazaar': 835,
      'Beggar': 243,
      'Bishop': 243,
      'Border Village': 817,
      'Bridge': 246,
      'Bureaucrat': 128,
      'Candlestick Maker': 734,
      'Caravan': 780,
      'Cartographer': 890,
      'Cellar': 450,
      'Chancellor': 160,
      // 'Chapel': wantsToTrash > 0 ? 146 : 30,
      'City': 829,
      'Conspirator': (state, my) => my.inPlay.length >= 2 ? 760 : (my.actions < 2 ? 124 : 10),
      // 'Coppersmith': my.countInHand('Copper') ? 0, 1 => 105 : 2 => 156 : 213,
      'Council Room': (state, my) => my.actions > 0 ? 619 : 194,
      'Counting House': 158,
      'Courtyard': (state, my) => my.actions > 1 && (my.discard.length + my.draw.length) <= 3 ? 615 : 188,
      // 'Crossroads': (state, my) => {
      //   // This represents a particularly dumb strategy. It doesn't even take into account whether it has any
      //   // victory cards, or whether it could draw more.
      //   my.countInPlay('Crossroads') > 0 ? 298 : 580
      // },
      'Cutpurse': 250,
      'Develop': 271, // A rough approximation to when you want to Develop: when all you've got to play is terminals.
      'Duchess': 102,
      'Embassy': (state, my) => my.actions > 1 ? 660 : 198,
      'Envoy': 203,
      'Expand': 226,
      // 'Explorer': my.countInHand('Province') > 1 ? 282 : 166,
      'Familiar': 755,
      'Farming Village': 838,
      'Feast': 108,
      'Festival': 845,
      'Fishing Village': 823,
      'Followers': 292,
      'Fortune Teller': 130,
      'Ghost Ship': (state, my) => my.actions > 1 ? 670 : 266,
      'Golem': 743,
      'Goons': 278,
      'Grand Market': 795,
      // I'll suppose Graverobber is a bit better to play than Remodel and worse than Expand, but I really don't know.
      'Graverobber': 225,
      'Great Hall': (state, my) => my.hand.indexOf(cards.Crossroads) > -1 ? 520 : 742,
      'Haven': 710,
      'Haggler': 170,
      'Hamlet': 720,
      'Harvest': 174,
      'Herbalist': 122,
      'Highway': 750,
      // 'Horn of Plenty': my.numUniqueCardsInPlay() >= 2 ? 10 : -10,
      'Horse Traders': 240,
      'Hunting Grounds': (state, my) => my.actions > 1 ? 666 : 201,
      'Hunting Party': 790,
      // The current ai_playValue assumes that Ironworks is a terminal. If it wants to gain an action, it should have
      // a higher value.
      'Ironworks': 115,
      'Island': 132,
      'Jack of All Trades': 236,
      'Jester': 258,
      // 'Journeyman': wantsToJM > ? 146 : 0,
      // 'King\'s Court': wantstoPlayMultiplier ? 910 : 390,
      'Laboratory': 832,

      /**
       * @todo
       if my.actions > 1
       switch my.hand.length
       when 0, 1, 2, 3 then 955
       when 4 then 695
       when 5 then 620
       when 6 then 420
       when 7 then 101
       else 20
       else
       switch my.hand.length
       when 0, 1, 2, 3 then 260
       when 4 then 210
       when 5 then 192
       when 6 then 118
       when 7 then 101
       else 20
       */
      'Library': (state, my) => my.actions > 1 ? 520 : 155,
      'Lighthouse': 715,
      'Loan': 70,
      'Lookout': (state, my) => state.gainsToEndGame() >= 5 || my.draw.indexOf(cards.Curse) > -1 ? 895 : -5,
      'Mandarin': 168,
      'Margrave': (state, my) => my.actions > 1 ? 685 : 280,
      'Masquerade': 270,
      'Market': 775,
      // 'Menagerie': my.menagerieDraws() === 3 ? 980 : 340,
      'Merchant Guild': 269,
      'Merchant Ship': 186,
      'Militia': 254,
      'Mine': 217,
      'Mining Village': 814,
      'Minion': 705,
      // 'Mint': this.choose('mint', state, my.hand) ? 140 : -7,
      'Moat': 120,
      'Moneylender': 230,
      'Monument': 182,
      'Mountebank': 290,
      'Navigator': 126,
      'Noble Brigand': 134,
      'Nobles': 296,
      'Nomad Camp': 162,
      'Oasis': 480,
      'Oracle': (state, my) => my.actions > 1 ? 610 : 180,
      // 'Outpost': state.extraTurn ? -15 : 154,
      'Pawn': 470,
      'Pearl Diver': 725,
      'Peddler': 770,
      'Pirate Ship': 136,
      'Plaza': 820,
      'Poor House': 103,
      'Princess': 264,
      'Rabble': (state, my) => my.actions > 1 ? 680 : 206,
      // 'Rats': wantsToPlayRats ? 486 : -1,
      // 'Remake': wantsToTrash >= multiplayer * 2 ? 178 : -35,
      // 'Rebuild': wantsToRebuild ? 1000 : -1,
      'Remodel': 223,
      'Rogue': 136,
      'Saboteur': 104,
      'Sage': 746,
      'Salvager': 220,
      'Scheme': 745,
      'Scout': 875,
      'Scrying Pool': 870,
      'Sea Hag': 286,
      'Secret Chamber': 138,
      // 'Shanty Town': my.shantyTownDraws(true) == 2 ? 970 : (my.actions < 2 ? 340 : 70),
      'Smithy': (state, my) => my.actions > 1 ? 665 : 200,
      'Smugglers': 110,
      'Soothsayer': 199,
      // 'Spice Merchant': my.hand.indexOf(cards.Copper) > -1 ? 740 : (spiceMerchantWantsToTrash ? 410 : 80),
      // 'Spoils': my.agent.wantsToPlaySpoils(state) ? 81 : null,
      'Spy': 860,
      // 'Stables': stablesDiscardChoice ? 735 :  50,
      'Steward': 233,
      'Tactician': 272, // playing Tactician is extremely situational and this doesn't take it into account.
      'Thief': 100,
      // 'Throne Room': this.wantsToPlayMultiplier(state) ? 920 : (this.okayToPlayMultiplier(state) ? 380 : -50),
      'Torturer': (state, my) => my.actions > 1 ? 690 : 284,
      // 'Tournament': my.countInHand('Province') == 3 ? 960 : 360,
      // 'Trade Route': wantsToTrash >= multiplier ? 160 : -25,
      // 'Transmute': this.choose('mint', state, my.hand) ? 106 : -27,
      // 'Trader': wantsToTrash >= multiplier ? 142 : -22,
      // 'Trading Post': wantsToTrash >= multiplier * 2 ? 148 : -38,
      // 'Treasure Map': (state, my) => {
      //   my.countInHand("Treasure Map") >= 2 ? 294 : (my.countInDeck("Gold") >= 4
      //     && state.current.countInDeck("Treasure Map") == 1 ? 90 : -40)
      // },
      'Treasury': 765,
      'Tribute': 281, // after Curses but before other terminals; there is probably a better spot for it
      'Trusty Steed': 848,
      'University': 842,
      // 'Upgrade': wantsToTrash >= multiplayer ? 490 : -30,
      'Vault': 268,
      'Venture': 80,
      'Village': 820,
      'Walled Village': 826,
      'Warehouse': 460,
      'Watchtower': (state, my) => {
        return my.actions > 1 ?
          (my.hand.length < 5 ? 650 : -1) :
          (my.hand.length < 4 ? 196 : (my.hand.length === 4 ? 190 : -1));
      },
      'Wharf': 275,
      'Wishing Well': 745,
      'Witch': (state, my) => my.actions > 1 ? 675 : 288,
      'Woodcutter': 164,
      'Worker\' Village': 832,
      'Workshop': 112,
      'Young Witch': 282
    };

    const cardName = card.toString();

    if (playValues[cardName]) {
      if (typeof playValues[cardName] === 'function') {
        return playValues[cardName](state, my);
      }

      return playValues[cardName];
    }

    if (card.isTreasure()) {
      return 100;
    }

    return null;
  }
}

BasicAI.CHOICE_DISCARD = 'discard';
