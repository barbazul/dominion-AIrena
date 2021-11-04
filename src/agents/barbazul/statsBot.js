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

export default class StatsBot extends ProxyAgent {
  constructor () {
    super();
    const tenGames = {
        BasicAI: { plays: 310, wins: 100.5, rate: 0.3241935483870968 },
        BigMoney: { plays: 310, wins: 116.5, rate: 0.3758064516129032 },
        'Big Smithy': { plays: 310, wins: 179.5, rate: 0.5790322580645161 },
        'BM Library': { plays: 310, wins: 172, rate: 0.5548387096774193 },
        'Chapel Witch': { plays: 310, wins: 214.5, rate: 0.6919354838709677 },
        'Double Militia': { plays: 310, wins: 157.5, rate: 0.5080645161290323 },
        'Double Witch': { plays: 310, wins: 235.5, rate: 0.7596774193548387 },
        'Moneylender Witch': { plays: 310, wins: 214.5, rate: 0.6919354838709677 },
        SillyAI: { plays: 310, wins: 22.5, rate: 0.07258064516129033 },
        'Single Witch': { plays: 310, wins: 215, rate: 0.6935483870967742 },
        'First Game by michaeljb': { plays: 290, wins: 104, rate: 0.3586206896551724 },
        'Bureaucrat/Gardens': { plays: 310, wins: 220.5, rate: 0.7112903225806452 },
        'Burning Skull HTBD#1': { plays: 300, wins: 230.5, rate: 0.7683333333333333 },
        'Council Room/Militia': { plays: 310, wins: 131, rate: 0.42258064516129035 },
        DomPlayer: { plays: 310, wins: 92, rate: 0.2967741935483871 },
        'Lab/Militia/Chapel': { plays: 300, wins: 194.5, rate: 0.6483333333333333 },
        Festival: { plays: 310, wins: 119.5, rate: 0.38548387096774195 },
        'Council Room': { plays: 310, wins: 177, rate: 0.5709677419354838 },
        Bureaucrat: { plays: 310, wins: 143, rate: 0.4612903225806452 },
        'Big Money Ultimate': { plays: 310, wins: 123, rate: 0.3967741935483871 },
        WorkshopGardens: { plays: 310, wins: 163, rate: 0.5258064516129032 },
        'Basic Big Money': { plays: 310, wins: 44, rate: 0.14193548387096774 },
        'Big Money Ultimate for 3 or 4': { plays: 310, wins: 71, rate: 0.22903225806451613 },
        'Double Moat for 3 or 4': { plays: 310, wins: 79, rate: 0.25483870967741934 },
        Laboratory: { plays: 310, wins: 124, rate: 0.4 },
        Militia: { plays: 310, wins: 156, rate: 0.5032258064516129 },
        Moat: { plays: 310, wins: 148, rate: 0.4774193548387097 },
        Smithy: { plays: 310, wins: 183, rate: 0.5903225806451613 },
        Witch: { plays: 310, wins: 251, rate: 0.8096774193548387 },
        'Witch and Moat for 3 or 4': { plays: 310, wins: 160, rate: 0.5161290322580645 },
        'Witch for 3 or 4': { plays: 310, wins: 199, rate: 0.6419354838709678 },
        StatsBot: { plays: 310, wins: 199, rate: 0.6419354838709678 }
      };
    const oneGame = {
      BasicAI: { plays: 31, wins: 8, rate: 0.25806451612903225 },
      BigMoney: { plays: 31, wins: 10.5, rate: 0.3387096774193548 },
      'Big Smithy': { plays: 31, wins: 18.5, rate: 0.5967741935483871 },
      'BM Library': { plays: 31, wins: 14, rate: 0.45161290322580644 },
      'Chapel Witch': { plays: 31, wins: 26, rate: 0.8387096774193549 },
      'Double Militia': { plays: 31, wins: 18.5, rate: 0.5967741935483871 },
      'Double Witch': { plays: 31, wins: 23, rate: 0.7419354838709677 },
      'Moneylender Witch': { plays: 31, wins: 22, rate: 0.7096774193548387 },
      SillyAI: { plays: 31, wins: 1, rate: 0.03225806451612903 },
      'Single Witch': { plays: 31, wins: 20, rate: 0.6451612903225806 },
      'First Game by michaeljb': { plays: 29, wins: 11, rate: 0.3793103448275862 },
      'Bureaucrat/Gardens': { plays: 31, wins: 23, rate: 0.7419354838709677 },
      'Burning Skull HTBD#1': { plays: 30, wins: 22.5, rate: 0.75 },
      'Council Room/Militia': { plays: 31, wins: 15.5, rate: 0.5 },
      DomPlayer: { plays: 31, wins: 10, rate: 0.3225806451612903 },
      'Lab/Militia/Chapel': { plays: 30, wins: 18.5, rate: 0.6166666666666667 },
      Festival: { plays: 31, wins: 16.5, rate: 0.532258064516129 },
      'Council Room': { plays: 31, wins: 16, rate: 0.5161290322580645 },
      Bureaucrat: { plays: 31, wins: 15.5, rate: 0.5 },
      'Big Money Ultimate': { plays: 31, wins: 9, rate: 0.2903225806451613 },
      WorkshopGardens: { plays: 31, wins: 15, rate: 0.4838709677419355 },
      'Basic Big Money': { plays: 31, wins: 1.5, rate: 0.04838709677419355 },
      'Big Money Ultimate for 3 or 4': { plays: 31, wins: 7.5, rate: 0.24193548387096775 },
      'Double Moat for 3 or 4': { plays: 31, wins: 8, rate: 0.25806451612903225 },
      Laboratory: { plays: 31, wins: 12, rate: 0.3870967741935484 },
      Militia: { plays: 31, wins: 15.5, rate: 0.5 },
      Moat: { plays: 31, wins: 17, rate: 0.5483870967741935 },
      Smithy: { plays: 31, wins: 17, rate: 0.5483870967741935 },
      Witch: { plays: 31, wins: 25, rate: 0.8064516129032258 },
      'Witch and Moat for 3 or 4': { plays: 31, wins: 12, rate: 0.3870967741935484 },
      'Witch for 3 or 4': { plays: 31, wins: 24.5, rate: 0.7903225806451613 },
      StatsBot: { plays: 31, wins: 20, rate: 0.6451612903225806 }
    };
    const hundredGames = {
      BasicAI: { plays: 3100, wins: 1099.5, rate: 0.3546774193548387 },
      BigMoney: { plays: 3100, wins: 1089.5, rate: 0.3514516129032258 },
      'Big Smithy': { plays: 3100, wins: 1715, rate: 0.5532258064516129 },
      'BM Library': { plays: 3100, wins: 1681, rate: 0.542258064516129 },
      'Chapel Witch': { plays: 3100, wins: 2278.5, rate: 0.735 },
      'Double Militia': { plays: 3100, wins: 1491.5, rate: 0.4811290322580645 },
      'Double Witch': { plays: 3100, wins: 2388, rate: 0.7703225806451612 },
      'Moneylender Witch': { plays: 3100, wins: 2093.5, rate: 0.6753225806451613 },
      SillyAI: { plays: 3100, wins: 292, rate: 0.09419354838709677 },
      'Single Witch': { plays: 3100, wins: 2212, rate: 0.7135483870967742 },
      'First Game by michaeljb': { plays: 2900, wins: 1036.5, rate: 0.3574137931034483 },
      'Bureaucrat/Gardens': { plays: 3100, wins: 2167, rate: 0.6990322580645161 },
      'Burning Skull HTBD#1': { plays: 3000, wins: 2228, rate: 0.7426666666666667 },
      'Council Room/Militia': { plays: 3100, wins: 1308.5, rate: 0.4220967741935484 },
      DomPlayer: { plays: 3100, wins: 1051.5, rate: 0.33919354838709675 },
      'Lab/Militia/Chapel': { plays: 3000, wins: 1886, rate: 0.6286666666666667 },
      Festival: { plays: 3100, wins: 1148, rate: 0.37032258064516127 },
      'Council Room': { plays: 3100, wins: 1758, rate: 0.5670967741935484 },
      Bureaucrat: { plays: 3100, wins: 1303.5, rate: 0.4204838709677419 },
      'Big Money Ultimate': { plays: 3100, wins: 1053, rate: 0.3396774193548387 },
      WorkshopGardens: { plays: 3100, wins: 1574, rate: 0.5077419354838709 },
      'Basic Big Money': { plays: 3100, wins: 480.5, rate: 0.155 },
      'Big Money Ultimate for 3 or 4': { plays: 3100, wins: 715.5, rate: 0.23080645161290322 },
      'Double Moat for 3 or 4': { plays: 3100, wins: 842, rate: 0.27161290322580645 },
      Laboratory: { plays: 3100, wins: 1363, rate: 0.4396774193548387 },
      Militia: { plays: 3100, wins: 1507.5, rate: 0.48629032258064514 },
      Moat: { plays: 3100, wins: 1473.5, rate: 0.4753225806451613 },
      Smithy: { plays: 3100, wins: 1780, rate: 0.5741935483870968 },
      Witch: { plays: 3100, wins: 2404, rate: 0.775483870967742 },
      'Witch and Moat for 3 or 4': { plays: 3100, wins: 1727.5, rate: 0.557258064516129 },
      'Witch for 3 or 4': { plays: 3100, wins: 2089.5, rate: 0.6740322580645162 },
      StatsBot: { plays: 3100, wins: 2162.5, rate: 0.6975806451612904 }
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
      new BurningSkullHTBD1(), new Witch()
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
