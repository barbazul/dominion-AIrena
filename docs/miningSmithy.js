import { DomPlayer } from '../src/agents/domsim/domPlayer.js';
import cards from '../src/game/cards.js';

export default class MiningSmithy extends DomPlayer {
  constructor() {
    super();
    this.name = 'Mining Smithy';
    this.requires = [ cards.Smithy, cards['Mining Village'] ];
  }
}