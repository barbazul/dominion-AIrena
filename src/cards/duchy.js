import Estate from './estate';

export default class Duchy extends Estate {
  constructor () {
    super();
    this.cost = 5;
    this.vp = 3;
  }
}
