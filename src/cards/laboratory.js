import BasicAction from './basicAction.js';

export default class Laboratory extends BasicAction {
  constructor () {
    super();
    this.cost = 5;
    this.actions = 1;
    this.cards = 2;
  }
}
