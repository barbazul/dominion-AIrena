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

    // If we get here, the AI probably wants to choose none of the above.
    if (choices.indexOf(null) > -1) {
      return null;
    }

    throw new Error(`${this.name} somehow failed to make a choice (${choices.join(',')})`);
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
   * @param {State} state
   * @param {Card} card
   * @param {Player} my
   * @return {number}
   */
  trashValue (state, card, my) {
    return 0 - card.vp - card.cost;
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
      // Priority #1: cards that succeed if we play them now, and might not if we play them later (950 - 999)
      /**
       * Evaluates whether it would trigger or not
       *
       * @param {State} state
       * @param {Player} my
       * @return {number}
       */
      'Menagerie': (state, my) => {
        // @todo This calculation should be a helper method in the card itself
        const cardsInHand = my.hand.map(c => c.toString());
        const indexOfMenagerie = cardsInHand.indexOf('Menagerie');
        let seen = null;

        // Remove Menagerie from hypothetical hand
        if (indexOfMenagerie > -1) {
          cardsInHand.splice(indexOfMenagerie, 1);
        }

        cardsInHand.sort();

        for (const c of cardsInHand) {
          if (c === seen) {
            return 340;
          }

          seen = c;
        }

        return 980;
      },

      /**
       * Evaluates whether it would trigger or not
       *
       * @param {State} state
       * @param {Player} my
       * @return {number}
       */
      'Shanty Town': (state, my) => {
        const cardsInHand = my.hand.slice();
        const indexOfShanty = cardsInHand.indexOf(cards.ShantyTown);

        if (indexOfShanty > -1) {
          cardsInHand.splice(indexOfShanty, 1);
        }

        for (const c of cardsInHand) {
          if (c.isAction()) {
            if (my.actions < 2) {
              return 340;
            }
            return 70;
          }
        }

        return 970;
      },

      /**
       * Cares if you have exactly 3 provinces in hand (why 3?)
       *
       * @param {State} state
       * @param {Player} my
       * @return {number}
       */
      'Tournament': (state, my) => {
        return my.countInHand('Province') === 3 ? 960 : 360;
      },

      /**
       * @param {State} state
       * @param {Player} my
       * @return {number}
       */
      'Library': (state, my) => {
        const terminalValues = [260, 260, 260, 260, 210, 192, 118, 101];
        const nonTerminalValues = [955, 955, 955, 955, 695, 620, 420, 101];

        if (my.actions > 1) {
          if (nonTerminalValues[my.hand.length]) {
            return nonTerminalValues[my.hand.length];
          }
        }

        if (terminalValues[my.hand.length]) {
          return terminalValues[my.hand.length];
        }

        return 20;
      },

      // 2: Multipliers that do something sufficiently cool. (900-949)

      /**
       * Simplified from what was in Dominiate.
       * Wants to throne if it has a non-throne action
       *
       * @param {State} state
       * @param {Player} my
       * @return {number}
       */
      'Throne Room': (state, my) => {
        for (const card of my.hand) {
          if (card.isAction() && card !== cards.ThroneRoom) {
            return 920;
          }
        }

        return -50;
      },

      /**
       * Removed the wantsToMultiply part for a more naive approach
       *
       * @param {State} state
       * @param {Player} my
       * @return {number}
       */
      'King\'s Court': (state, my) => {
        for (const card of my.hand) {
          if (card.isAction() && card !== cards.KingsCourt) {
            return 910;
          }
        }

        return 390;
      },

      // 3: cards that stack the deck. (850-899)
      /**
       * @param {State} state
       * @param {Player} my
       * @return {number}
       */
      'Lookout': (state, my) => {
        return state.gainsToEndGame() >= 5 || my.draw.indexOf(cards.Curse) > -1 ? 895 : -5;
      },
      'Cartographer': 890,
      'Bag of Gold': 885,
      'Apothecary': 880,
      'Scout': 875,
      'Scrying Pool': 870,
      'Spy': 860,

      // 4: cards that give +2 actions. (800-849)
      'Trusty Steed': 848,
      'Festival': 845,
      'University': 842,
      'Farming Village': 838,
      'Bazaar': 835,
      'Worker\' Village': 832,
      'City': 829,
      'Walled Village': 826,
      'Fishing Village': 823,
      'Village': 820,
      'Border Village': 817,
      'Mining Village': 814,

      // 5: cards that give +1 action and are almost always good. (700-800)
      'Grand Market': 795,
      'Hunting Party': 790,
      'Alchemist': 785,
      'Laboratory': 782,
      'Caravan': 780,
      'Market': 775,
      'Peddler': 770,
      'Treasury': 765,

      /**
       * Removed the check for multiplier
       *
       * @param {State} state
       * @param {Player} my
       * @return {number}
       */
      'Conspirator': (state, my) => {
        if (my.inPlay.length >= 2) {
          return 760;
        }

        if (my.actions < 2) {
          return 124;
        }

        return 10;
      },

      'Familiar': 755,
      'Highway': 750,
      'Scheme': 745,
      'Wishing Well': 745,
      'Golem': 743, // seems to be reasonable to expect +1 action from Golem

      /**
       * @param {State} state
       * @param {Player} my
       * @return {number}
       */
      'Great Hall': (state, my) => {
        return my.hand.indexOf(cards.Crossroads) > -1 ? 520 : 742;
      },

      // 'Spice Merchant': (state, my) => my.hand.indexOf(cards.Copper) > -1 ? 740 : (spiceMerchantWantsToTrash ? 410 : 80),
      // 'Stables': stablesDiscardChoice ? 735 :  50,
      'Apprentice': 730,
      'Pearl Diver': 725,
      'Hamlet': 720,
      'Lighthouse': 715,
      'Haven': 710,
      'Minion': 705,

      // 6: terminal card-drawers, if we have actions to spare. (600-699)
      /**
       * @param {State} state
       * @param {Player} my
       * @return {number}
       */
      'Watchtower': (state, my) => {
        if (my.actions > 1) {
          if (my.hand.length < 5) {
            return 650;
          }
        }

        if (my.hand.length < 4) {
          return 196;
        }

        if (my.hand.length === 4) {
          return 190;
        }

        return -1;
      },

      /**
       * @param {State} state
       * @param {Player} my
       * @return {number}
       */
      'Courtyard': (state, my) => {
        return my.actions > 1 && (my.discard.length + my.draw.length) <= 3 ? 615 : 188;
      },

      // Unified Torturer, Margrave, Rabble, Witch, Ghost Ship, Smithy, Embassy and Council Room in a single terminal
      // draw logic (see below)

      // Leaving Oracle as a special case because it does not read +2 draw
      'Oracle': (state, my) => my.actions > 1 ? 610 : 180,

      //  7: Let's insert here an overly simplistic idea of how to play Crossroads.

      /**
       * @param {State} state
       * @param {Player} my
       * @return {number}
       */
      'Crossroads': (state, my) => {
        // This represents a particularly dumb strategy. It doesn't even take into account whether it has any
        // victory cards, or whether it could draw more.
        return my.countInPlay('Crossroads') > 0 ? 298 : 580;
      },

      // 8: card-cycling that might improve the hand. (400-499)
      // 'Upgrade': wantsToTrash >= multiplayer ? 490 : -30,
      'Oasis': 480,
      'Pawn': 470,
      'Warehouse': 460,
      'Cellar': 450,

      // 9: non-terminal cards that don't succeed but at least give us something. (300-399)
      // 10: terminals. Of course, Nobles might be a non-terminal
      'Nobles': 296,

      /**
       * @param {State} state
       * @param {Player} my
       * @return {number}
       */
      'Treasure Map': (state, my) => {
        if (my.countInHand('Treasure Map') >= 2) {
          return 294;
        }

        if (my.countInDeck('Gold') >= 4 && state.current.countInDeck('Treasure Map') === 1) {
          return 90;
        }

        return -40;
      },
      'Followers': 292,
      'Mountebank': 290,
      'Sea Hag': 286,
      'Young Witch': 282,
      'Tribute': 281, // after Curses but before other terminals; there is probably a better spot for it
      'Goons': 278,
      'Wharf': 275,
      'Tactician': 272, // playing Tactician is extremely situational and this doesn't take it into account.
      'Masquerade': 270,
      'Vault': 268,
      'Princess': 264,

      /**
       * @param {State} state
       * @param {Player} my
       * @return {number}
       */
      'Explorer': (state, my) => {
        return my.countInHand('Province') > 0 ? 282 : 166;
      },
      'Jester': 258,
      'Militia': 254,
      'Cutpurse': 250,
      'Bridge': 246,
      'Bishop': 243,
      'Horse Traders': 240,
      'Jack of All Trades': 236,
      'Steward': 233,
      'Moneylender': 230,
      'Expand': 226,
      'Remodel': 223,
      'Salvager': 220,
      'Mine': 217,

      /**
       * @param {State} state
       * @param {Player} my
       * @return {number}
       */
      'Coppersmith': (state, my) => {
        switch (my.countInHand('Copper')) {
          case 0:
          case 1:
            return 105;
          case 2:
            return 156;
          default:
            return 213;
        }
      },
      'Envoy': 203,
      'Merchant Ship': 186,

      /**
       * Simplification to avoid implementing cardInDeckValue
       *
       * @param {State} state
       * @param {Player} my
       * @return {number}
       */
      'Baron': (state, my) => {
        if (my.hand.indexOf(cards.Estate) > -1) {
          return 184;
        }

        // @todo Should use choiceToValue
        if (this.gainValue(state, cards.Estate, my) > 0) {
          return 5;
        }

        return -5;
      },
      'Monument': 182,
      // 'Remake': wantsToTrash >= multiplayer * 2 ? 178 : -35,
      'Adventurer': 176,
      'Harvest': 174,
      'Haggler': 170,
      'Mandarin': 168,
      'Woodcutter': 164,
      'Nomad Camp': 162,
      'Chancellor': 160,
      'Counting House': 158,
      // 'Outpost': state.extraTurn ? -15 : 154,
      // 'Ambassador': my.actions > 0 && wantsToTrash > 0 ? 1100 : -1
      // 'Trading Post': wantsToTrash >= multiplier * 2 ? 148 : -38,
      'Chapel': (state, my) => {
        if (my.agent.wantsToTrash(state, my) > 0) {
          return 146;
        }

        return 30;
      },
      // 'Trader': wantsToTrash >= multiplier ? 142 : -22,
      // 'Trade Route': wantsToTras >= multiplier ? 160 : -25,
      // 'Mint': this.choose('mint', state, my.hand) ? 140 : -7,
      'Secret Chamber': 138,
      'Pirate Ship': 136,
      'Noble Brigand': 134,
      'Island': 132,
      'Fortune Teller': 130,
      'Bureaucrat': 128,
      'Navigator': 126,
      'Herbalist': 122,
      'Moat': 120,
      'Ironworks': 115,
      'Workshop': 112,
      'Smugglers': 110,
      'Feast': 108,
      // 'Transmute': this.choose('mint', state, my.hand) ? 106 : -27,
      'Saboteur': 104,
      'Poor House': 103,
      'Duchess': 102,
      'Thief': 100

      // 11: cards that have become useless. Maybe they'll decrease
      // the cost of Peddler, trigger Conspirator, or something. (20-99)

      // 12: Conspirator when +actions remain. (10)

      // At this point, we take no action if that choice is available.

      // 'Advisor': 1000,
      // 'Bandit Camp': 821,
      // 'Baker': 774,
      // 'Bank': 20,
      // 'Beggar': 243,
      // 'Candlestick Maker': 734,
      // 'Develop': 271, // A rough approximation to when you want to Develop: when all you've got to play is terminals.
      // I'll suppose Graverobber is a bit better to play than Remodel and worse than Expand, but I really don't know.
      // 'Graverobber': 225,
      // 'Horn of Plenty': my.numUniqueCardsInPlay() >= 2 ? 10 : -10,
      // 'Hunting Grounds': (state, my) => my.actions > 1 ? 666 : 201,
      // The current ai_playValue assumes that Ironworks is a terminal. If it wants to gain an action, it should have
      // a higher value.
      // 'Journeyman': wantsToJM > ? 146 : 0,
      // 'Loan': 70,
      // 'Merchant Guild': 269,
      // 'Plaza': 820,
      // 'Rats': wantsToPlayRats ? 486 : -1,
      // 'Rebuild': wantsToRebuild ? 1000 : -1,
      // 'Rogue': 136,
      // 'Sage': 746,
      // 'Soothsayer': 199,
      // 'Spoils': my.agent.wantsToPlaySpoils(state) ? 81 : null,
      // 'Venture': 80,
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

    if (card.isAction() && card.cards > 0 && card.actions === 0) {
      if (my.actions > 1) {
        return state.rng() * 100 + 600;
      }

      return state.rng() * 110 + 180;
    }

    return null;
  }

  /**
   *
   * @param {State} state
   * @param {Player} my
   * @return {number}
   * @todo Avoid using the decision engine here
   */
  wantsToTrash (state, my) {
    let trashableCards = 0;

    for (let card of my.hand) {
      if (this.choose(BasicAI.CHOICE_TRASH, state, [card, null])) {
        trashableCards++;
      }
    }

    return trashableCards;
  }
}

BasicAI.CHOICE_DISCARD = 'discard';
BasicAI.CHOICE_TRASH = 'trash';
