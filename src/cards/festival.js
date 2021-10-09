import BasicAction from './basicAction.js';

export default class Festival extends BasicAction {
  constructor () {
    super();
    this.cost = 5;
    this.actions = 2;
    this.buys = 1;
    this.coins = 2;
  }
}
