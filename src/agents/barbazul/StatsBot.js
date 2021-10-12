import ProxyAgent from '../proxyAgent.js';
import SillyAI from "../dominiate/sillyAI.js";
import BasicBigMoney from "../domsim/basicBigMoney.js";
import BasicAI from "../basicAI.js";
import {DomPlayer} from "../domsim/domPlayer.js";
import FirstGame from "../domsim/firstGame.js";
import BigMoneyUltimate from "../domsim/bigMoneyUltimate.js";
import BigMoney from "../dominiate/bigMoney.js";
import Festival from "../domsim/festival.js";
import CouncilRoomMilitia from "../domsim/councilRoomMilitia.js";
import Bureaucrat from "../domsim/bureaucrat.js";
import Militia from "../domsim/militia.js";
import DoubleMilitia from "../dominiate/doubleMilitia.js";
import Laboratory from "../domsim/laboratory.js";
import BMLibrary from "../dominiate/bmLibrary.js";
import Moat from "../domsim/moat.js";
import WorkshopGardens from "../domsim/workshopGardens.js";
import Smithy from "../domsim/smithy.js";
import BigSmithy from "../dominiate/bigSmithy.js";
import CouncilRoom from "../domsim/councilRoom.js";
import LabMilitiaChapel from "../domsim/labMilitiaChapel.js";
import MoneylenderWitch from "../dominiate/moneylenderWitch.js";
import BureaucratGardens from "../domsim/bureaucratGardens.js";
import ChapelWitch from "../dominiate/chapelWitch.js";
import SingleWitch from "../dominiate/singleWitch.js";
import DoubleWitch from "../dominiate/doubleWitch.js";
import BurningSkullHTBD1 from "../domsim/burningSkullHTBD1.js";
import Witch from "../domsim/witch.js";
import SingleBaron from "../dominiate/singleBaron.js";

export default class StatsBot extends ProxyAgent {
  constructor() {
    super();
    const tenGames = {
      BasicAI: {plays: 330, wins: 102, rate: 0.3090909090909091},
      BigMoney: {plays: 330, wins: 117, rate: 0.35454545454545455},
      'Big Smithy': {plays: 330, wins: 176, rate: 0.5333333333333333},
      'BM Library': {plays: 330, wins: 178.5, rate: 0.5409090909090909},
      'Chapel Witch': {plays: 330, wins: 248, rate: 0.7515151515151515},
      'Double Militia': {plays: 330, wins: 175, rate: 0.5303030303030303},
      'Double Witch': {plays: 330, wins: 266, rate: 0.806060606060606},
      'Moneylender Witch': {plays: 330, wins: 225.5, rate: 0.6833333333333333},
      SillyAI: {plays: 330, wins: 23.5, rate: 0.07121212121212121},
      'Single Witch': {plays: 330, wins: 242.5, rate: 0.7348484848484849},
      'First Game by michaeljb': {plays: 310, wins: 118.5, rate: 0.38225806451612904},
      'Bureaucrat/Gardens': {plays: 330, wins: 225.5, rate: 0.6833333333333333},
      'Burning Skull HTBD#1': {plays: 320, wins: 247, rate: 0.771875},
      'Council Room/Militia': {plays: 330, wins: 141, rate: 0.42727272727272725},
      DomPlayer: {plays: 330, wins: 119.5, rate: 0.3621212121212121},
      'Lab/Militia/Chapel': {plays: 320, wins: 203, rate: 0.634375},
      Festival: {plays: 330, wins: 115, rate: 0.3484848484848485},
      'Council Room': {plays: 330, wins: 188.5, rate: 0.5712121212121212},
      Bureaucrat: {plays: 330, wins: 137.5, rate: 0.4166666666666667},
      'Big Money Ultimate': {plays: 330, wins: 112.5, rate: 0.3409090909090909},
      WorkshopGardens: {plays: 330, wins: 169, rate: 0.5121212121212121},
      'Basic Big Money': {plays: 330, wins: 51, rate: 0.15454545454545454},
      'Big Money Ultimate for 3 or 4': {plays: 330, wins: 80, rate: 0.24242424242424243},
      'Double Moat for 3 or 4': {plays: 330, wins: 79, rate: 0.23939393939393938},
      Laboratory: {plays: 330, wins: 164.5, rate: 0.4984848484848485},
      Militia: {plays: 330, wins: 177, rate: 0.5363636363636364},
      Moat: {plays: 330, wins: 148, rate: 0.4484848484848485},
      Smithy: {plays: 330, wins: 189, rate: 0.5727272727272728},
      Witch: {plays: 330, wins: 265.5, rate: 0.8045454545454546},
      'Witch and Moat for 3 or 4': {plays: 330, wins: 186.5, rate: 0.5651515151515152},
      'Witch for 3 or 4': {plays: 330, wins: 216.5, rate: 0.656060606060606},
      'Single Baron': {plays: 330, wins: 130.5, rate: 0.39545454545454545},
      StatsBot: {plays: 330, wins: 229.5, rate: 0.6954545454545454},
      'OBM Bridge': {plays: 330, wins: 142, rate: 0.4303030303030303}
    };

    const oneGame = {
      BasicAI: {plays: 33, wins: 11, rate: 0.3333333333333333},
      BigMoney: {plays: 33, wins: 8.5, rate: 0.25757575757575757},
      'Big Smithy': {plays: 33, wins: 16, rate: 0.48484848484848486},
      'BM Library': {plays: 33, wins: 17, rate: 0.5151515151515151},
      'Chapel Witch': {plays: 33, wins: 25.5, rate: 0.7727272727272727},
      'Double Militia': {plays: 33, wins: 14.5, rate: 0.4393939393939394},
      'Double Witch': {plays: 33, wins: 25, rate: 0.7575757575757576},
      'Moneylender Witch': {plays: 33, wins: 23, rate: 0.696969696969697},
      SillyAI: {plays: 33, wins: 2, rate: 0.06060606060606061},
      'Single Witch': {plays: 33, wins: 21.5, rate: 0.6515151515151515},
      'First Game by michaeljb': {plays: 31, wins: 13.5, rate: 0.43548387096774194},
      'Bureaucrat/Gardens': {plays: 33, wins: 25, rate: 0.7575757575757576},
      'Burning Skull HTBD#1': {plays: 32, wins: 21.5, rate: 0.671875},
      'Council Room/Militia': {plays: 33, wins: 12, rate: 0.36363636363636365},
      DomPlayer: {plays: 33, wins: 18, rate: 0.5454545454545454},
      'Lab/Militia/Chapel': {plays: 32, wins: 20, rate: 0.625},
      Festival: {plays: 33, wins: 16, rate: 0.48484848484848486},
      'Council Room': {plays: 33, wins: 21, rate: 0.6363636363636364},
      Bureaucrat: {plays: 33, wins: 12.5, rate: 0.3787878787878788},
      'Big Money Ultimate': {plays: 33, wins: 9, rate: 0.2727272727272727},
      WorkshopGardens: {plays: 33, wins: 18, rate: 0.5454545454545454},
      'Basic Big Money': {plays: 33, wins: 3, rate: 0.09090909090909091},
      'Big Money Ultimate for 3 or 4': {plays: 33, wins: 9.5, rate: 0.2878787878787879},
      'Double Moat for 3 or 4': {plays: 33, wins: 11.5, rate: 0.3484848484848485},
      Laboratory: {plays: 33, wins: 16, rate: 0.48484848484848486},
      Militia: {plays: 33, wins: 17.5, rate: 0.5303030303030303},
      Moat: {plays: 33, wins: 18.5, rate: 0.5606060606060606},
      Smithy: {plays: 33, wins: 20.5, rate: 0.6212121212121212},
      Witch: {plays: 33, wins: 27, rate: 0.8181818181818182},
      'Witch and Moat for 3 or 4': {plays: 33, wins: 20, rate: 0.6060606060606061},
      'Witch for 3 or 4': {plays: 33, wins: 16.5, rate: 0.5},
      'Single Baron': {plays: 33, wins: 10, rate: 0.30303030303030304},
      StatsBot: {plays: 33, wins: 25.5, rate: 0.7727272727272727},
      'OBM Bridge': {plays: 33, wins: 13, rate: 0.3939393939393939}
    };

    const hundredGames = {
      BasicAI: {plays: 3300, wins: 1141.5, rate: 0.3459090909090909},
      BigMoney: {plays: 3300, wins: 1145, rate: 0.346969696969697},
      'Big Smithy': {plays: 3300, wins: 1845, rate: 0.5590909090909091},
      'BM Library': {plays: 3300, wins: 1817.5, rate: 0.5507575757575758},
      'Chapel Witch': {plays: 3300, wins: 2424, rate: 0.7345454545454545},
      'Double Militia': {plays: 3300, wins: 1685.5, rate: 0.5107575757575757},
      'Double Witch': {plays: 3300, wins: 2580, rate: 0.7818181818181819},
      'Moneylender Witch': {plays: 3300, wins: 2236.5, rate: 0.6777272727272727},
      SillyAI: {plays: 3300, wins: 287.5, rate: 0.08712121212121213},
      'Single Witch': {plays: 3300, wins: 2390.5, rate: 0.7243939393939394},
      'First Game by michaeljb': {plays: 3100, wins: 1146, rate: 0.3696774193548387},
      'Bureaucrat/Gardens': {plays: 3300, wins: 2258, rate: 0.6842424242424242},
      'Burning Skull HTBD#1': {plays: 3200, wins: 2402.5, rate: 0.75078125},
      'Council Room/Militia': {plays: 3300, wins: 1437, rate: 0.4354545454545454},
      DomPlayer: {plays: 3300, wins: 1137, rate: 0.34454545454545454},
      'Lab/Militia/Chapel': {plays: 3200, wins: 2019.5, rate: 0.63109375},
      Festival: {plays: 3300, wins: 1227.5, rate: 0.37196969696969695},
      'Council Room': {plays: 3300, wins: 1924.5, rate: 0.5831818181818181},
      Bureaucrat: {plays: 3300, wins: 1401, rate: 0.42454545454545456},
      'Big Money Ultimate': {plays: 3300, wins: 1167.5, rate: 0.35378787878787876},
      WorkshopGardens: {plays: 3300, wins: 1756.5, rate: 0.5322727272727272},
      'Basic Big Money': {plays: 3300, wins: 491.5, rate: 0.14893939393939393},
      'Big Money Ultimate for 3 or 4': {plays: 3300, wins: 779.5, rate: 0.2362121212121212},
      'Double Moat for 3 or 4': {plays: 3300, wins: 947.5, rate: 0.2871212121212121},
      Laboratory: {plays: 3300, wins: 1468, rate: 0.4448484848484848},
      Militia: {plays: 3300, wins: 1611.5, rate: 0.48833333333333334},
      Moat: {plays: 3300, wins: 1603, rate: 0.4857575757575758},
      Smithy: {plays: 3300, wins: 1919, rate: 0.5815151515151515},
      Witch: {plays: 3300, wins: 2607, rate: 0.79},
      'Witch and Moat for 3 or 4': {plays: 3300, wins: 1821, rate: 0.5518181818181818},
      'Witch for 3 or 4': {plays: 3300, wins: 2259.5, rate: 0.6846969696969697},
      'Single Baron': {plays: 3300, wins: 1396, rate: 0.42303030303030303},
      StatsBot: {plays: 3300, wins: 2221, rate: 0.673030303030303},
      'OBM Bridge': {plays: 3300, wins: 1345.5, rate: 0.4077272727272727}
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

  doGameAnalysis(state, my) {
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
