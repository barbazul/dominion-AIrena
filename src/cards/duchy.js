import Estate from './estate.js';

export default class Duchy extends Estate {
  constructor () {
    super();
    this.cost = 5;
    this.vp = 3;
  }
}
