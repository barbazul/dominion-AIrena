import Card from './card.js';

export default class Curse extends Card {
  constructor () {
    super();
    this.vp = -1;
    this.types = ['Curse'];
  }

  startingSupply (state) {
    return state.players.length * 10 - 10;
  }
}
