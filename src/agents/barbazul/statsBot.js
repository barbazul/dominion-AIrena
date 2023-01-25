import ProxyAgent from '../proxyAgent.js';
import SillyAI from '../dominiate/sillyAI.js';
import BasicBigMoney from '../domsim/basicBigMoney.js';
import BasicAI from '../basicAI.js';
import { DomPlayer } from '../domsim/domPlayer.js';
import FirstGame from '../domsim/firstGame.js';
import BigMoneyUltimate from '../domsim/bigMoneyUltimate.js';
import BigMoney from '../dominiate/bigMoney.js';
import Festival from '../domsim/festival.js';
import CouncilRoomMilitia from '../domsim/councilRoomMilitia.js';
import Bureaucrat from '../domsim/bureaucrat.js';
import Militia from '../domsim/militia.js';
import DoubleMilitia from '../dominiate/doubleMilitia.js';
import Laboratory from '../domsim/laboratory.js';
import BMLibrary from '../dominiate/bmLibrary.js';
import Moat from '../domsim/moat.js';
import WorkshopGardens from '../domsim/workshopGardens.js';
import Smithy from '../domsim/smithy.js';
import BigSmithy from '../dominiate/bigSmithy.js';
import CouncilRoom from '../domsim/councilRoom.js';
import LabMilitiaChapel from '../domsim/labMilitiaChapel.js';
import MoneylenderWitch from '../dominiate/moneylenderWitch.js';
import BureaucratGardens from '../domsim/bureaucratGardens.js';
import ChapelWitch from '../dominiate/chapelWitch.js';
import SingleWitch from '../dominiate/singleWitch.js';
import DoubleWitch from '../dominiate/doubleWitch.js';
import BurningSkullHTBD1 from '../domsim/burningSkullHTBD1.js';
import Witch from '../domsim/witch.js';
import * as fs from 'fs';
import BigMoneyUltimateFor3or4 from '../domsim/bigMoneyUltimateFor3or4.js';
import DoubleMoatFor3or4 from '../domsim/doubleMoatFor3or4.js';
import WitchAndMoatFor3or4 from '../domsim/witchAndMoatFor3or4.js';
import WitchFor3or4 from '../domsim/witchFor3or4.js';
import Artisan from './artisan.js';

export default class StatsBot extends ProxyAgent {
  constructor (options = {}) {
    super();

    const defaultConfig = './config/statsBot.json';
    const statsFile = './var/statsBot.json';
    const readFile = fs.existsSync(statsFile) ? statsFile : defaultConfig;
    this.writeFile = statsFile;

    this.stats = JSON.parse(fs.readFileSync(
      readFile,
      {
        encoding: 'utf8',
        flags: 'r'
      }
    ));

    this.agents = [
      new BasicAI(),
      new BigMoney(),
      new BigSmithy(),
      new BMLibrary(),
      new ChapelWitch(),
      new DoubleMilitia(),
      new DoubleWitch(),
      new MoneylenderWitch(),
      new SillyAI(), // index: 8
      new SingleWitch(),
      new FirstGame(),
      new BureaucratGardens(),
      new BurningSkullHTBD1(),
      new CouncilRoomMilitia(),
      new DomPlayer(),
      new LabMilitiaChapel(),
      new Festival(),
      new CouncilRoom(),
      new Bureaucrat(),
      new BigMoneyUltimate(),
      new WorkshopGardens(),
      new BasicBigMoney(),
      new BigMoneyUltimateFor3or4(),
      new DoubleMoatFor3or4(),
      new Laboratory(),
      new Militia(),
      new Moat(),
      new Smithy(),
      new Witch(),
      new WitchAndMoatFor3or4(),
      new WitchFor3or4(),
      new Artisan()
    ];
  }

  doGameAnalysis (state, my) {
    const candidates = this.getCandidatesForCurrentKingdom(state);

    // TODO Currently agent with best average is selected. Implement other selection policies.
    // Epsilon-Greedy https://www.geeksforgeeks.org/epsilon-greedy-algorithm-in-reinforcement-learning/
    // Epsilon-Decreasing/Decaying
    // Adaptive Epsilon-Greedy http://www.tokic.com/www/tokicm/publikationen/papers/AdaptiveEpsilonGreedyExploration.pdf
    // Optimistic-Greedy https://towardsdatascience.com/bandit-algorithms-34fd7890cb18#1519
    // UCB https://towardsdatascience.com/the-upper-confidence-bound-ucb-bandit-algorithm-c05c2bf4c13f
    // LinUCB
    // LinRel

    let winner = candidates[0];
    let score = this.stats[winner] === undefined ? 0 : this.stats[winner].rate;

    candidates.forEach(candidate => {
      // Skip candidates for which we have no stats
      const candidateScore = this.stats[candidate] === undefined
        ? 0 : this.stats[candidate].rate;

      if (candidateScore > score) {
        winner = candidate;
        score = candidateScore;
      }
    });

    this.setActualAgent(winner);
    console.log(winner.toString());
  }

  getCandidatesForCurrentKingdom (state) {
    return this.agents.filter(bot => {
      for (let requirement of bot.requires) {
        if (state.kingdom[requirement] === undefined) {
          return false;
        }
      }

      return true;
    });
  }

  recordResult (result) {
    this.stats[this.actualAgent].plays++;
    this.stats[this.actualAgent].wins += result;
    this.stats[this.actualAgent].rate = this.stats[this.actualAgent].wins / this.stats[this.actualAgent].plays;
  }

  saveStats () {
    fs.writeFileSync(this.writeFile, JSON.stringify(this.stats), { encoding: 'utf8' });
  }
}
