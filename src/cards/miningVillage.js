import Village from './village.js';
import { LOCATION_IN_PLAY, LOCATION_TRASH } from '../game/player.js';

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
  playEffect (state) {
    // 1. Check if trashing is allowed (card was played on the table and was not removed by other effect)
    if (state.current.playLocation === LOCATION_IN_PLAY) {
      // 2. Check if agent wants to trash
      if (state.current.agent.wantsToTrashMiningVillage(state, state.current)) {
        // 3. Move card from play to trash
        const index = state.current.inPlay.indexOf(this);
        state.current.inPlay.splice(index, 1);
        state.trash.push(this);
        state.current.playLocation = LOCATION_TRASH;
        state.current.log('...trashing the Mining Village for +$2.');
        // 4. Increase coins
        state.current.coins += 2;
      } else {
        state.current.log('...decides to keep it');
      }
    }
  }
}
