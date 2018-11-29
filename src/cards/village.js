import BasicAction from './basicAction';

export default class Village extends BasicAction {
  constructor () {
    super();
    this.cost = 3;
    this.actions = 2;
    this.cards = 1;
  }
}
