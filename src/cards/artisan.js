import { CHOICE_DISCARD, CHOICE_GAIN } from '../agents/basicAI';
import cards from '../game/cards';
import BasicAction from './basicAction';

export default class Artisan extends BasicAction {
  constructor () {
    super();
    this.cost = 6;
  }

  /**
   * Gain a card to your hand costing up to $5.
   * Put a card from your hand onto your deck.
   *
   * @param {State} state
   */
  playEffect (state) {
    this.doGainPart(state);
    this.doTopdeckPart(state);
  }

  doTopdeckPart (state) {
    let chosenTopdeck;
    chosenTopdeck = state.current.agent.choose(CHOICE_DISCARD, state, [...new Set(state.current.hand)]);
    state.doTopdeck(state.current, chosenTopdeck);
  }

  doGainPart (state) {
    const choices = [];
    let chosenGain;
    for (let card in state.kingdom) {
      if (cards[card].cost <= 5 && state.kingdom[card] > 0) {
        choices.push(cards[card]);
      }
    }

    chosenGain = state.current.agent.choose(CHOICE_GAIN, state, choices);

    if (chosenGain) {
      state.gainCard(state.current, chosenGain, 'hand');
    }
  }
}
