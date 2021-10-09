import Estate from './estate.js';

export default class Province extends Estate {
  constructor () {
    super();
    this.cost = 8;
    this.vp = 6;
  }

  startingSupply (state) {
    const numPlayers = state.players.length;
    let multiplier;

    switch (numPlayers) {
      case 2:
      case 3:
        multiplier = 4;
        break;
      default:
        multiplier = 3;
    }

    return numPlayers * multiplier;
  }
}
