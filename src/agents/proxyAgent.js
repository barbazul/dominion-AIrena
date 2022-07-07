import BasicAI from './basicAI.js';

export default class ProxyAgent extends BasicAI {
  constructor () {
    super();

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
     * Make sure the actual agent will retrieve the player with the proxyAI
     * when asked for myPlayer.
     */
    ai.myPlayer = (state) => this.myPlayer(state);
  }

  /**
   * @return {ProxyAgent|BasicAI}
   */
  copy () {
    const newAgent = super.copy();

    newAgent.setActualAgent(this.actualAgent.copy());

    return newAgent;
  }

  /**
   * Temporary proxy method for DomPlayer agents
   *
   * @deprecated
   * @todo Use https://gist.github.com/loilo/4d385d64e2b8552dcc12a0f5126b6df8 to have magic methods
   * @param {Player} my
   * @return {int}
   */
  getTotalMoney (my) {
    if (this.actualAgent.getTotalMoney) {
      return this.actualAgent.getTotalMoney(my);
    }

    return 0;
  }

  /**
   * Temporary proxy method for DomPlayer agents
   *
   * @param {Player} my
   * @param {State} state
   * @param {Card} cardToTrash
   * @return {boolean}
   */
  removingReducesBuyingPower (my, state, cardToTrash) {
    if (this.actualAgent.removingReducesBuyingPower) {
      return this.actualAgent.removingReducesBuyingPower(my, state, cardToTrash);
    }

    return false;
  }
}
