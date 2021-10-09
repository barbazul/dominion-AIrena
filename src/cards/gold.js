import Silver from './silver.js';

export default class Gold extends Silver {
  constructor () {
    super();
    this.cost = 6;
    this.coins = 3;
  }

  startingSupply (state) {
    if (state.players.length > 4) {
      return 60;
    }

    return 30;
  }
}
