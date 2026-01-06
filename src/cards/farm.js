import Estate from './estate.js';

export default class Farm extends Estate {
  constructor () {
    super();
    this.cost = 6;
    this.coins = 2;
    this.vp = 2;
    this.types = ['Treasure', 'Victory'];
  }
}
