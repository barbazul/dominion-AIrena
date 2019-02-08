import BasicAction from './basicAction';

export default class Festival extends BasicAction {
  constructor () {
    super();
    this.cost = 5;
    this.actions = 2;
    this.buys = 1;
    this.coins = 2;
  }
}
