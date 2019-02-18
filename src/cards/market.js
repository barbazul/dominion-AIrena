import BasicAction from './basicAction';

export default class Market extends BasicAction {
  constructor () {
    super();
    this.cost = 5;
    this.actions = 1;
    this.cards = 1;
    this.buys = 1;
    this.coins = 1;
  }
}
