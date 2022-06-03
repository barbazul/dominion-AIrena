import BasicAI from './basicAI.js';

// TODO Use https://gist.github.com/loilo/4d385d64e2b8552dcc12a0f5126b6df8 to have magic methods
export default class ProxyAgent {
  constructor () {
    this.requires = [];
    this.name = this.constructor.name;

    /**
     * @type {BasicAI}
     */
    this.actualAgent = null;
  }

  /**
   * Forwards all choices to the actual ai
   *
   * {@inheritDoc}
   */
  choose (type, state, choices) {
    return this.getActualAgent().choose(type, state, choices);
  }

  /**
   * @return {BasicAI}
   */
  getActualAgent () {
    if (!this.actualAgent) {
      this.actualAgent = new BasicAI();
    }

    return this.actualAgent;
  }

  /**
   * @param {BasicAI} ai
   */
  setActualAgent (ai) {
    this.actualAgent = ai;

    /**
     * Make sure the actual agent will retrieve the player with the proxyAgent
     * when asked for myPlayer.
     */
    ai.myPlayer = this.myPlayer.bind(this);

    /**
     * Add proxy methods for any proprietary agent methods.
     * Used for DomSim compatibility.
     */

    let obj = ai;
    while (obj) {
      Object.getOwnPropertyNames(obj).forEach(property => {
        if (typeof obj[property] === 'function' && typeof this[property] === 'undefined') {
          console.log('Adding proxy method ' + ai.toString() + ':' + property);
          this[property] = (...args) => this.actualAgent[property](...args);
        }
      });

      obj = Object.getPrototypeOf(obj);
    }
  }

  /**
   * Same logic as BasicAI.myPlayer, but with for proxyAgent.
   *
   * @see BasicAI.myPlayer
   * @param {State} state
   */
  myPlayer (state) {
    for (let i = 0; i < state.players.length; i++) {
      if (state.players[i].agent === this) {
        return state.players[i];
      }
    }

    throw new Error(this.name + ' is being asked a decision but is not playing');
  }

  /**
   * Same as BasicAI.copy, but also copies the actual agent.
   *
   * @see BasicAI.copy
   * @return {ProxyAgent|BasicAI}
   */
  copy () {
    const newAgent = new this.constructor();
    newAgent.name = this.name + '*';
    newAgent.setActualAgent(this.actualAgent.copy());
    return newAgent;
  }

  toString () {
    return this.name;
  }
}
