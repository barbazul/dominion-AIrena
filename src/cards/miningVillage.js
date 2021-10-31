import Village from './village.js';

export default class MiningVillage extends Village {
  constructor () {
    super();
    this.name = 'Mining Village';
    this.cost = 4;
  }

  /**
   * You may trash this for +$2
   *
   * @param {State} state
   */
  playEffect(state) {
    /**
     *
     if state.current.ai.choose('miningVillageTrash', state, [yes, no])
     if state.current.playLocation != 'trash'
     transferCard(c['Mining Village'], state.current[state.current.playLocation], state.trash)
     state.current.playLocation = 'trash'
     state.log("...trashing the Mining Village for +$2.")
     state.current.coins += 2

     */

  }
}