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
      BasicAI: { plays: 320, wins: 114.5, rate: 0.3578125 },
      BigMoney: { plays: 320, wins: 122, rate: 0.38125 },
      'Big Smithy': { plays: 320, wins: 168.5, rate: 0.5265625 },
      'BM Library': { plays: 320, wins: 170, rate: 0.53125 },
      'Chapel Witch': { plays: 320, wins: 224, rate: 0.7 },
      'Double Militia': { plays: 320, wins: 156.5, rate: 0.4890625 },
      'Double Witch': { plays: 320, wins: 256.5, rate: 0.8015625 },
      'Moneylender Witch': { plays: 320, wins: 217.5, rate: 0.6796875 },
      SillyAI: { plays: 320, wins: 25, rate: 0.078125 },
      'Single Witch': { plays: 320, wins: 238.5, rate: 0.7453125 },
      'First Game by michaeljb': { plays: 300, wins: 113, rate: 0.37666666666666665 },
      'Bureaucrat/Gardens': { plays: 320, wins: 221.5, rate: 0.6921875 },
      'Burning Skull HTBD#1': { plays: 310, wins: 239.5, rate: 0.7725806451612903 },
      'Council Room/Militia': { plays: 320, wins: 125, rate: 0.390625 },
      DomPlayer: { plays: 320, wins: 111, rate: 0.346875 },
      'Lab/Militia/Chapel': { plays: 310, wins: 195.5, rate: 0.6306451612903226 },
      Festival: { plays: 320, wins: 110.5, rate: 0.3453125 },
      'Council Room': { plays: 320, wins: 192, rate: 0.6 },
      Bureaucrat: { plays: 320, wins: 131, rate: 0.409375 },
      'Big Money Ultimate': { plays: 320, wins: 126, rate: 0.39375 },
      WorkshopGardens: { plays: 320, wins: 152.5, rate: 0.4765625 },
      'Basic Big Money': { plays: 320, wins: 47, rate: 0.146875 },
      'Big Money Ultimate for 3 or 4': { plays: 320, wins: 73, rate: 0.228125 },
      'Double Moat for 3 or 4': { plays: 320, wins: 91.5, rate: 0.2859375 },
      Laboratory: { plays: 320, wins: 133, rate: 0.415625 },
      Militia: { plays: 320, wins: 155, rate: 0.484375 },
      Moat: { plays: 320, wins: 152, rate: 0.475 },
      Smithy: { plays: 320, wins: 193, rate: 0.603125 },
      Witch: { plays: 320, wins: 252, rate: 0.7875 },
      'Witch and Moat for 3 or 4': { plays: 320, wins: 166, rate: 0.51875 },
      'Witch for 3 or 4': { plays: 320, wins: 226.5, rate: 0.7078125 },
      'Single Baron': { plays: 320, wins: 125.5, rate: 0.3921875 },
      StatsBot: { plays: 320, wins: 235, rate: 0.734375 }
    };

    const oneGame = {
      BasicAI: {plays: 32, wins: 11.5, rate: 0.359375},
      BigMoney: {plays: 32, wins: 12, rate: 0.375},
      'Big Smithy': {plays: 32, wins: 14, rate: 0.4375},
      'BM Library': {plays: 32, wins: 22, rate: 0.6875},
      'Chapel Witch': {plays: 32, wins: 27, rate: 0.84375},
      'Double Militia': {plays: 32, wins: 14, rate: 0.4375},
      'Double Witch': {plays: 32, wins: 21, rate: 0.65625},
      'Moneylender Witch': {plays: 32, wins: 22.5, rate: 0.703125},
      SillyAI: {plays: 32, wins: 7, rate: 0.21875},
      'Single Witch': {plays: 32, wins: 22.5, rate: 0.703125},
      'First Game by michaeljb': {plays: 30, wins: 6, rate: 0.2},
      'Bureaucrat/Gardens': {plays: 32, wins: 23.5, rate: 0.734375},
      'Burning Skull HTBD#1': {plays: 31, wins: 27, rate: 0.8709677419354839},
      'Council Room/Militia': {plays: 32, wins: 17, rate: 0.53125},
      DomPlayer: {plays: 32, wins: 11.5, rate: 0.359375},
      'Lab/Militia/Chapel': {plays: 31, wins: 16, rate: 0.5161290322580645},
      Festival: {plays: 32, wins: 13, rate: 0.40625},
      'Council Room': {plays: 32, wins: 15, rate: 0.46875},
      Bureaucrat: {plays: 32, wins: 16.5, rate: 0.515625},
      'Big Money Ultimate': {plays: 32, wins: 10, rate: 0.3125},
      WorkshopGardens: {plays: 32, wins: 12.5, rate: 0.390625},
      'Basic Big Money': {plays: 32, wins: 4.5, rate: 0.140625},
      'Big Money Ultimate for 3 or 4': {plays: 32, wins: 8.5, rate: 0.265625},
      'Double Moat for 3 or 4': {plays: 32, wins: 9, rate: 0.28125},
      Laboratory: {plays: 32, wins: 11, rate: 0.34375},
      Militia: {plays: 32, wins: 15, rate: 0.46875},
      Moat: {plays: 32, wins: 15.5, rate: 0.484375},
      Smithy: {plays: 32, wins: 14.5, rate: 0.453125},
      Witch: {plays: 32, wins: 27, rate: 0.84375},
      'Witch and Moat for 3 or 4': {plays: 32, wins: 16.5, rate: 0.515625},
      'Witch for 3 or 4': {plays: 32, wins: 25, rate: 0.78125},
      'Single Baron': {plays: 32, wins: 15, rate: 0.46875},
      StatsBot: {plays: 32, wins: 23, rate: 0.71875}
    };

    const hundredGames = {
      BasicAI: {plays: 3200, wins: 1116.5, rate: 0.34890625},
      BigMoney: {plays: 3200, wins: 1087.5, rate: 0.33984375},
      'Big Smithy': {plays: 3200, wins: 1794.5, rate: 0.56078125},
      'BM Library': {plays: 3200, wins: 1729, rate: 0.5403125},
      'Chapel Witch': {plays: 3200, wins: 2371.5, rate: 0.74109375},
      'Double Militia': {plays: 3200, wins: 1603, rate: 0.5009375},
      'Double Witch': {plays: 3200, wins: 2494, rate: 0.779375},
      'Moneylender Witch': {plays: 3200, wins: 2196.5, rate: 0.68640625},
      SillyAI: {plays: 3200, wins: 267, rate: 0.0834375},
      'Single Witch': {plays: 3200, wins: 2329.5, rate: 0.72796875},
      'First Game by michaeljb': {plays: 3000, wins: 1116.5, rate: 0.37216666666666665},
      'Bureaucrat/Gardens': {plays: 3200, wins: 2229.5, rate: 0.69671875},
      'Burning Skull HTBD#1': {plays: 3100, wins: 2362.5, rate: 0.7620967741935484},
      'Council Room/Militia': {plays: 3200, wins: 1381, rate: 0.4315625},
      DomPlayer: {plays: 3200, wins: 1099, rate: 0.3434375},
      'Lab/Militia/Chapel': {plays: 3100, wins: 1939, rate: 0.6254838709677419},
      Festival: {plays: 3200, wins: 1223, rate: 0.3821875},
      'Council Room': {plays: 3200, wins: 1741.5, rate: 0.54421875},
      Bureaucrat: {plays: 3200, wins: 1402.5, rate: 0.43828125},
      'Big Money Ultimate': {plays: 3200, wins: 1111, rate: 0.3471875},
      WorkshopGardens: {plays: 3200, wins: 1630.5, rate: 0.50953125},
      'Basic Big Money': {plays: 3200, wins: 497, rate: 0.1553125},
      'Big Money Ultimate for 3 or 4': {plays: 3200, wins: 753, rate: 0.2353125},
      'Double Moat for 3 or 4': {plays: 3200, wins: 855, rate: 0.2671875},
      Laboratory: {plays: 3200, wins: 1388.5, rate: 0.43390625},
      Militia: {plays: 3200, wins: 1566, rate: 0.489375},
      Moat: {plays: 3200, wins: 1535.5, rate: 0.47984375},
      Smithy: {plays: 3200, wins: 1856.5, rate: 0.58015625},
      Witch: {plays: 3200, wins: 2509.5, rate: 0.78421875},
      'Witch and Moat for 3 or 4': {plays: 3200, wins: 1725, rate: 0.5390625},
      'Witch for 3 or 4': {plays: 3200, wins: 2158, rate: 0.674375},
      'Single Baron': {plays: 3200, wins: 1320.5, rate: 0.41265625},
      StatsBot: {plays: 3200, wins: 2210.5, rate: 0.69078125}
    };

    this.stats = hundredGames

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
