import { PHASE_ACTION } from '../../game/state.js';
import { DomPlayer } from './domPlayer.js';
import cards from "../../game/cards.js";

/**
 * This is a bot built for the First Game suggested set of 10. It utilizes 8 of the 10 available kingdom cards, and was
 * built against HiveMindEmulator's Smithy bot for Geronimoo's First Game challenge.
 *
 * @author michaeljb
 */
export default class FirstGame extends DomPlayer {
  constructor () {
    super();
    this.name = 'First Game by michaeljb';
    this.requires = [
        cards.Smithy, cards.Cellar, cards.Mine, cards.Market, cards.Remodel,
        cards.Village, cards.Workshop, cards.Militia
    ];
  }

  /**
   *
   * @param {State} state
   * @param {Player} my
   * @return {String[]}
   */
  gainPriority (state, my) {
    // HACK
    if (my.countCardTypeInDeck === undefined) {
      my.countCardTypeInDeck = function (type) {
        let count = 0;

        for (let card of this.getDeck()) {
          if (card.types.indexOf(type) !== -1) {
            count++;
          }
        }

        return count;
      };
    }


    // HACK
    if (my.countMaxOpponentVP === undefined) {
      my.countMaxOpponentVP = function (state) {
        let maxvp = 0;

        for (let player of state.players) {
          let vp = 0;
          if (player !== this) {
            for (let card of player.getDeck()) {
              vp += card.getVP(player);
            }
          }

          maxvp = Math.max(maxvp, vp);
        }

        return maxvp;
      };
    }

    // HACK
    if (my.countVP === undefined) {
      my.countVP = function () {
        let vp = 0;

        for (let card of this.getDeck()) {
          vp += card.getVP(this);
        }

        return vp;
      };
    }

    const priority = [];

    this.addEndGameGreening(state, my, priority);

    this.firstTurns(my, priority);

    if (my.countInDeck(cards.Market) === 0) {
      priority.push(cards.Market);
    }

    if (my.countInDeck(cards.Gold) < 1) {
      priority.push(cards.Gold);
    }

    this.addEngineParts(my, state, priority);

    if (state.phase !== PHASE_ACTION) {
      if (my.countInDeck(cards.Cellar) < 1) {
        priority.push(cards.Cellar);
      }

      if (my.countInDeck(cards.Cellar) < 2 && my.countInDeck(cards.Smithy) > 0) {
        priority.push(cards.Cellar);
      }
    }

    this.midturnGainCellar(state, my, priority);

    if (state.phase === PHASE_ACTION) {
      priority.push(cards.Gold);
      priority.push(cards.Silver);
    }

    if (my.countInDeck(cards.Cellar) < 3 && my.countCardTypeInDeck('Victory') > 3) {
      priority.push(cards.Cellar);
    }

    this.replenishPayload(my, priority);

    priority.push(null); // Dont buy other stuff

    return priority;
  }

  firstTurns (my, priority) {
    if (my.countInDeck('Mine') === 0 && my.countInDeck(cards.Market) > 0) {
      priority.push('Mine');
    }

    if (my.turnsTaken <= 2) {
      priority.push('Mine');
    }

    if (my.countInDeck('Remodel') === 0) {
      priority.push('Remodel');
    }

    if (this.countTypeInDeck(my, 'Terminal') > my.countInDeck('Village') + 1) {
      priority.push('Village');
    }

    if (my.countInDeck('Workshop') === 0 && my.countInDeck(cards.Smithy) < 4) {
      priority.push('Workshop');
    }

    if (my.countInDeck('Militia') === 0 && my.countInDeck(cards.Smithy) > 2) {
      priority.push('Militia');
    }
  }

  midturnGainCellar (state, my, priority) {
    if (state.phase === PHASE_ACTION && my.countInHand('Militia') === 0 &&
      my.countInHand('Workshop') === 0 && my.countInHand('Mine') === 0) {
      if (my.countInDeck(cards.Cellar) < 1) {
        priority.push(cards.Cellar);
      }

      if (my.countInDeck(cards.Cellar) < 2 && my.countInDeck(cards.Smithy) > 0) {
        priority.push(cards.Cellar);
      }
    }
  }

  addEngineParts (my, state, priority) {
    this.getVillaWithExtraBuys(my, state, priority);

    this.getMarkets(my, state, priority);

    this.midturnGainSmiithy(state, my, priority);

    if (my.countInDeck('Village') < this.countTypeInDeck(my, 'Terminal')) {
      priority.push('Village');
    }

    if (my.countInDeck(cards.Smithy) < 6) {
      priority.push(cards.Smithy);
    }

    if (state.phase !== PHASE_ACTION) {
      priority.push(cards.Market);
    }

    if (my.countInDeck('Village') < 9) {
      priority.push('Village');
    }
  }

  getMoneyInHand (my) {
    return my.coins + my.countInHand('Copper') + 2 * my.countInHand(cards.Silver) +
      3 * my.countInHand(cards.Gold);
  }

  midturnGainSmiithy (state, my, priority) {
    if (state.phase !== PHASE_ACTION) {
      return;
    }

    const hasTerminalSpace = this.getHasTerminalSpace(my);
    const moneyInHand = this.getMoneyInHand(my);

    if (hasTerminalSpace && moneyInHand === 3) {
      priority.push(cards.Smithy);
    }
  }

  getHasTerminalSpace (my) {
    return my.countInDeck('Village') === this.countTypeInDeck(my, 'Terminal') - 1 &&
      my.countInDeck(cards.Smithy) < 6;
  }

  getMarkets (my, state, priority) {
    if (my.countInDeck(cards.Market) < 5 && state.phase !== PHASE_ACTION && my.countInDeck(cards.Smithy) > 1) {
      priority.push(cards.Market);
    }

    if (my.countInDeck(cards.Market) < 5 && state.phase === PHASE_ACTION && my.countInDeck(cards.Smithy) > 3 &&
      my.countInHand('Mine') === 0) {
      priority.push(cards.Market);
    }
  }

  getVillaWithExtraBuys (my, state, priority) {
    if (my.buys > 1 &&
      my.coins === 7 &&
      state.phase !== PHASE_ACTION) {
      priority.push('Village');
    }

    if (state.phase !== PHASE_ACTION &&
      my.coins === 6 &&
      my.buys > 1 &&
      this.countTypeInDeck(my, 'Terminal') > my.countInDeck('Village') &&
      state.countInSupply('Village') > 1 && my.countInDeck(cards.Smithy) > 1) {
      priority.push('Village');
    }
  }

  replenishPayload (my, priority) {
    if (my.countCardTypeInDeck('Treasure') < 7) {
      priority.push(cards.Silver);
    }

    if (my.countCardTypeInDeck('Treasure') < 5) {
      priority.push('Copper');
    }
  }

  addEndGameGreening (state, my, priority) {
    this.duchyDancing(state, my, priority);

    if (my.countInDeck(cards.Province) > 0) {
      priority.push(cards.Province);
    }

    if (my.countInDeck(cards.Smithy) > 4 &&
      my.coins > 13 &&
      my.buys > 1) {
      priority.push(cards.Province);
    }

    if (my.countInDeck(cards.Province) > 0 && state.countInSupply(cards.Province) <= 5) {
      priority.push(cards.Duchy);
    }

    this.panicPoints(my, priority, state);
  }

  panicPoints (my, priority, state) {
    if (my.countInDeck(cards.Province) > 2 &&
      my.countInDeck(cards.Cellar) > 0 &&
      my.countInDeck(cards.Smithy) > 5) {
      priority.push('Estate');
    }

    if (state.countInSupply(cards.Province) <= 2) {
      priority.push('Estate');
    }
  }

  duchyDancing (state, my, priority) {
    if (state.countInSupply(cards.Province) > 2 &&
      my.countVP() <= my.countMaxOpponentVP(state) - 20 &&
      state.phase !== PHASE_ACTION &&
      my.countInDeck(cards.Province) > 0) {
      priority.push(cards.Duchy);
    }

    if (state.countInSupply(cards.Province) === 2 &&
      my.countVP() <= my.countMaxOpponentVP(state) &&
      state.phase !== PHASE_ACTION) {
      priority.push(cards.Duchy);
    }
  }
}
