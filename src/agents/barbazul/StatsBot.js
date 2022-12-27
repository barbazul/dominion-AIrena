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
import SingleBaron from '../dominiate/singleBaron.js';

export default class StatsBot extends ProxyAgent {
  constructor () {
    super();
    const hundredGames = {
      BasicAI: { plays: 3300, wins: 1141.5, rate: 0.3459090909090909 },
      BigMoney: { plays: 3300, wins: 1145, rate: 0.346969696969697 },
      'Big Smithy': { plays: 3300, wins: 1845, rate: 0.5590909090909091 },
      'BM Library': { plays: 3300, wins: 1817.5, rate: 0.5507575757575758 },
      'Chapel Witch': { plays: 3300, wins: 2424, rate: 0.7345454545454545 },
      'Double Militia': { plays: 3300, wins: 1685.5, rate: 0.5107575757575757 },
      'Double Witch': { plays: 3300, wins: 2580, rate: 0.7818181818181819 },
      'Moneylender Witch': { plays: 3300, wins: 2236.5, rate: 0.6777272727272727 },
      SillyAI: { plays: 3300, wins: 287.5, rate: 0.08712121212121213 },
      'Single Witch': { plays: 3300, wins: 2390.5, rate: 0.7243939393939394 },
      'First Game by michaeljb': { plays: 3100, wins: 1146, rate: 0.3696774193548387 },
      'Bureaucrat/Gardens': { plays: 3300, wins: 2258, rate: 0.6842424242424242 },
      'Burning Skull HTBD#1': { plays: 3200, wins: 2402.5, rate: 0.75078125 },
      'Council Room/Militia': { plays: 3300, wins: 1437, rate: 0.4354545454545454 },
      DomPlayer: { plays: 3300, wins: 1137, rate: 0.34454545454545454 },
      'Lab/Militia/Chapel': { plays: 3200, wins: 2019.5, rate: 0.63109375 },
      Festival: { plays: 3300, wins: 1227.5, rate: 0.37196969696969695 },
      'Council Room': { plays: 3300, wins: 1924.5, rate: 0.5831818181818181 },
      Bureaucrat: { plays: 3300, wins: 1401, rate: 0.42454545454545456 },
      'Big Money Ultimate': { plays: 3300, wins: 1167.5, rate: 0.35378787878787876 },
      WorkshopGardens: { plays: 3300, wins: 1756.5, rate: 0.5322727272727272 },
      'Basic Big Money': { plays: 3300, wins: 491.5, rate: 0.14893939393939393 },
      'Big Money Ultimate for 3 or 4': { plays: 3300, wins: 779.5, rate: 0.2362121212121212 },
      'Double Moat for 3 or 4': { plays: 3300, wins: 947.5, rate: 0.2871212121212121 },
      Laboratory: { plays: 3300, wins: 1468, rate: 0.4448484848484848 },
      Militia: { plays: 3300, wins: 1611.5, rate: 0.48833333333333334 },
      Moat: { plays: 3300, wins: 1603, rate: 0.4857575757575758 },
      Smithy: { plays: 3300, wins: 1919, rate: 0.5815151515151515 },
      Witch: { plays: 3300, wins: 2607, rate: 0.79 },
      'Witch and Moat for 3 or 4': { plays: 3300, wins: 1821, rate: 0.5518181818181818 },
      'Witch for 3 or 4': { plays: 3300, wins: 2259.5, rate: 0.6846969696969697 },
      'Single Baron': { plays: 3300, wins: 1396, rate: 0.42303030303030303 },
      StatsBot: { plays: 3300, wins: 2221, rate: 0.673030303030303 },
      'OBM Bridge': { plays: 3300, wins: 1345.5, rate: 0.4077272727272727 }
    };

    this.stats = hundredGames;

    this.agents = [
      new SillyAI(), new BasicBigMoney(), new BasicAI(), new DomPlayer(),
      new FirstGame(), new BigMoneyUltimate(), new BigMoney(), new Festival(),
      new CouncilRoomMilitia(), new Bureaucrat(), new Militia(),
      new DoubleMilitia(), new Laboratory(), new BMLibrary(), new Moat(),
      new WorkshopGardens(), new Smithy(), new BigSmithy(), new CouncilRoom(),
      new LabMilitiaChapel(), new MoneylenderWitch(), new BureaucratGardens(),
      new ChapelWitch(), new SingleWitch(), new DoubleWitch(),
      new BurningSkullHTBD1(), new Witch(), new SingleBaron()
    ];
  }

  doGameAnalysis (state, my) {
    const candidates = this.agents.filter(bot => {
      for (let requirement of bot.requires) {
        if (state.kingdom[requirement] === undefined) {
          return false;
        }
      }

      return true;
    });

    let winner = candidates[0];
    let score = this.stats[winner].rate;

    candidates.forEach(candidate => {
      const candidateScore = this.stats[candidate].rate;

      if (candidateScore > score) {
        winner = candidate;
        score = candidateScore;
      }
    });

    this.setActualAgent(winner);
  }
}
