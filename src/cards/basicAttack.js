import BasicAction from './basicAction.js';

/**
 * Most common attack case is an action that is also an attack.
 * This class exists to avoid defining each attack action as an attack
 */
export default class BasicAttack extends BasicAction {
  constructor () {
    super();
    this.types.push('Attack');
  }
}
