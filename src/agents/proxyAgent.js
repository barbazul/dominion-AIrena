import BasicAI from './basicAI';

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
}