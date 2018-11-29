import Card from './card';

export default class Silver extends Card {
  constructor () {
    super();
    this.types = ['Treasure'];
    this.cost = 3;
    this.coins = 2;
  }

  startingSupply (state) {
    if (state.players.length > 4) {
      return 80;
    }

    return 40;
  }
}
