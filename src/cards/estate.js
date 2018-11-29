import Card from './card';

export default class Estate extends Card {
  constructor () {
    super();
    this.cost = 2;
    this.vp = 1;
    this.types = ['Victory'];
  }

  startingSupply (state) {
    if (state.players.length > 2) {
      return 12;
    }

    return 8;
  }
}
