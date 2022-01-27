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

    // TODO Move statistics to a config file
    // Stryker disable ObjectLiteral: No value in mutating the statistics. They will be moved to a config file later.
    this.stats = {
      BasicAI: {plays: 3100, wins: 1099.5, rate: 0.3546774193548387},
      BigMoney: {plays: 3100, wins: 1089.5, rate: 0.3514516129032258},
      'Big Smithy': {plays: 3100, wins: 1715, rate: 0.5532258064516129},
      'BM Library': {plays: 3100, wins: 1681, rate: 0.542258064516129},
      'Chapel Witch': {plays: 3100, wins: 2278.5, rate: 0.735},
      'Double Militia': {plays: 3100, wins: 1491.5, rate: 0.4811290322580645},
      'Double Witch': {plays: 3100, wins: 2388, rate: 0.7703225806451612},
      'Moneylender Witch': {plays: 3100, wins: 2093.5, rate: 0.6753225806451613},
      SillyAI: {plays: 3100, wins: 292, rate: 0.09419354838709677},
      'Single Witch': {plays: 3100, wins: 2212, rate: 0.7135483870967742},
      'First Game by michaeljb': {plays: 2900, wins: 1036.5, rate: 0.3574137931034483},
      'Bureaucrat/Gardens': {plays: 3100, wins: 2167, rate: 0.6990322580645161},
      'Burning Skull HTBD#1': {plays: 3000, wins: 2228, rate: 0.7426666666666667},
      'Council Room/Militia': {plays: 3100, wins: 1308.5, rate: 0.4220967741935484},
      DomPlayer: {plays: 3100, wins: 1051.5, rate: 0.33919354838709675},
      'Lab/Militia/Chapel': {plays: 3000, wins: 1886, rate: 0.6286666666666667},
      Festival: {plays: 3100, wins: 1148, rate: 0.37032258064516127},
      'Council Room': {plays: 3100, wins: 1758, rate: 0.5670967741935484},
      Bureaucrat: {plays: 3100, wins: 1303.5, rate: 0.4204838709677419},
      'Big Money Ultimate': {plays: 3100, wins: 1053, rate: 0.3396774193548387},
      WorkshopGardens: {plays: 3100, wins: 1574, rate: 0.5077419354838709},
      'Basic Big Money': {plays: 3100, wins: 480.5, rate: 0.155},
      'Big Money Ultimate for 3 or 4': {plays: 3100, wins: 715.5, rate: 0.23080645161290322},
      'Double Moat for 3 or 4': {plays: 3100, wins: 842, rate: 0.27161290322580645},
      Laboratory: {plays: 3100, wins: 1363, rate: 0.4396774193548387},
      Militia: {plays: 3100, wins: 1507.5, rate: 0.48629032258064514},
      Moat: {plays: 3100, wins: 1473.5, rate: 0.4753225806451613},
      Smithy: {plays: 3100, wins: 1780, rate: 0.5741935483870968},
      Witch: {plays: 3100, wins: 2404, rate: 0.775483870967742},
      'Witch and Moat for 3 or 4': {plays: 3100, wins: 1727.5, rate: 0.557258064516129},
      'Witch for 3 or 4': {plays: 3100, wins: 2089.5, rate: 0.6740322580645162},
      StatsBot: {plays: 3100, wins: 2162.5, rate: 0.6975806451612904}
    }
    // Stryker restore ObjectLiteral

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
    let score = this.stats[winner] === undefined ? 0 : this.stats[winner].rate;

    candidates.forEach(candidate => {
      // Skip candidates for which we have no stats
      const candidateScore = this.stats[candidate] === undefined ?
        0 : this.stats[candidate].rate;

      if (candidateScore > score) {
        winner = candidate;
        score = candidateScore;
      }
    });

    this.setActualAgent(winner);
    console.log(winner.toString());
  }
}
