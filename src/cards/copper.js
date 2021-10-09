import Silver from './silver.js';

export default class Copper extends Silver {
  constructor () {
    super();
    this.cost = 0;
    this.coins = 1;
  }

  startingSupply (state) {
    const numPlayers = state.players.length;
    let base = 60;

    if (numPlayers > 4) {
      base = 120;
    }

    // Coppers in initial decks come from the supply
    return base - 7 * numPlayers;
  };
};
