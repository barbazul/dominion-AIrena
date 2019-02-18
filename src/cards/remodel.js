import BasicAI from '../agents/basicAI';
import cards from '../game/cards';
import BasicAction from './basicAction';

export default class Remodel extends BasicAction {
  constructor () {
    super();
    this.cost = 4;
  }

  /**
   * Trash a card from your hand.
   * Gain a card costing up to $2 more than it.
   *
   * Not using the whole upgradeFilter logic from Dominiate for now.
   *
   * @param {State} state
   */
  playEffect (state) {
    const choices = [];
    let choice;
    let used = [];

    for (let card of state.current.hand) {
      if (used.indexOf(card) === -1) {
        used.push(card);

        for (let cardName in state.kingdom) {
          if (state.kingdom.hasOwnProperty(cardName)) {
            let card2;

            if (state.countInSupply(cardName) === 0) {
              continue;
            }

            card2 = cards[cardName];

            if (card.cost + 2 >= card2.cost) {
              choices.push({ trash: [card], gain: [card2] });
            }
          }
        }
      }
    }

    // Todo found a bug:
    // TypeError: Cannot read property 'trash' of null
    // at Remodel.playEffect (file:///C:/wamp64/www/dominion/src/cards/remodel.js:48:41)
    // at Remodel.onPlay (file:///C:/wamp64/www/dominion/src/cards/card.js:103:10)
    // at State.resolveAction (file:///C:/wamp64/www/dominion/src/game/state.js:220:12)
    // at ThroneRoom.playEffect (file:///C:/wamp64/www/dominion/src/cards/throneRoom.js:37:13)
    // at ThroneRoom.onPlay (file:///C:/wamp64/www/dominion/src/cards/card.js:103:10)
    // at State.resolveAction (file:///C:/wamp64/www/dominion/src/game/state.js:220:12)
    // at ThroneRoom.playEffect (file:///C:/wamp64/www/dominion/src/cards/throneRoom.js:37:13)
    // at ThroneRoom.onPlay (file:///C:/wamp64/www/dominion/src/cards/card.js:103:10)
    // at State.resolveAction (file:///C:/wamp64/www/dominion/src/game/state.js:220:12)
    // at State.playAction (file:///C:/wamp64/www/dominion/src/game/state.js:208:10)
    //
    // Nuevo caso. Mas info:
    // cleanup phase
    // (SillyAI shuffles.)
    // SillyAI draws 5 cards: Cellar,Copper,Remodel,Cellar,Duchy.
    // [...]
    // === SillyAI's turn 15
    // start phase
    // action phase
    // SillyAI plays Cellar.
    // SillyAI discards Duchy.
    // SillyAI discards Copper.
    // SillyAI draws 2 cards: Estate,Throne Room.
    // SillyAI plays Throne Room.
    // SillyAI plays Cellar.
    // SillyAI discards Estate.
    // SillyAI draws 1 cards: Throne Room.
    // ...plays Cellar again.
    // SillyAI draws 0 cards: .
    // SillyAI plays Throne Room.
    // SillyAI plays Remodel.
    // (crash)
    choice = state.current.agent.choose(BasicAI.CHOICE_UPGRADE, state, choices);

    state.doTrash(state.current, choice.trash[0]);
    state.gainCard(state.current, choice.gain[0]);
  }
}
