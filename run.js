import BasicAI from './src/agents/basicAI.js';
import BigMoney from './src/agents/dominiate/bigMoney.js';
import BigSmithy from './src/agents/dominiate/bigSmithy.js';
import BMLibrary from './src/agents/dominiate/bmLibrary.js';
import ChapelWitch from './src/agents/dominiate/chapelWitch.js';
import DoubleMilitia from './src/agents/dominiate/doubleMilitia.js';
import DoubleWitch from './src/agents/dominiate/doubleWitch.js';
import MoneylenderWitch from './src/agents/dominiate/moneylenderWitch.js';
import SillyAI from './src/agents/dominiate/sillyAI.js';
import SingleWitch from './src/agents/dominiate/singleWitch.js';
import BureaucratGardens from './src/agents/domsim/bureaucratGardens.js';
import CouncilRoomMilitia from './src/agents/domsim/councilRoomMilitia.js';
import FirstGame from './src/agents/domsim/firstGame.js';
import BurningSkullHTBD1 from './src/agents/domsim/burningSkullHTBD1.js';
import State, { PHASE_CLEANUP, PHASE_START } from './src/game/state.js';
import LabMilitiaChapel from './src/agents/domsim/labMilitiaChapel.js';
import Festival from './src/agents/domsim/festival.js';
import CouncilRoom from './src/agents/domsim/councilRoom.js';
import Bureaucrat from './src/agents/domsim/bureaucrat.js';
import BigMoneyUltimate from './src/agents/domsim/bigMoneyUltimate.js';
import WorkshopGardens from './src/agents/domsim/workshopGardens.js';
import BasicBigMoney from './src/agents/domsim/basicBigMoney.js';
import BigMoneyUltimateFor3or4 from './src/agents/domsim/bigMoneyUltimateFor3or4.js';
import DoubleMoatFor3or4 from './src/agents/domsim/doubleMoatFor3or4.js';
import Laboratory from './src/agents/domsim/laboratory.js';
import Militia from './src/agents/domsim/militia.js';
import Moat from './src/agents/domsim/moat.js';
import Smithy from './src/agents/domsim/smithy.js';
import Witch from './src/agents/domsim/witch.js';
import WitchAndMoatFor3or4 from './src/agents/domsim/witchAndMoatFor3or4.js';
import WitchFor3or4 from './src/agents/domsim/witchFor3or4.js';
import StatsBot from "./src/agents/barbazul/statsBot.js";

const players = [
  new SillyAI(), // 0
  new BasicAI(),
  new BigMoney(),
  new BigSmithy(),
  new BMLibrary(),
  new BureaucratGardens(),
  new BurningSkullHTBD1(), // 6
  new ChapelWitch(),
  new CouncilRoomMilitia(), // 8
  new DoubleMilitia(),
  new DoubleWitch(),
  new FirstGame(), // 11
  new MoneylenderWitch(),
  new LabMilitiaChapel(), // 13
  new Festival(),
  new SingleWitch(),
  new CouncilRoom(),
  new Bureaucrat(),
  new BigMoneyUltimate(), // 18
  new WorkshopGardens(),
  new BasicBigMoney(), // 20
  new BigMoneyUltimateFor3or4(),
  new DoubleMoatFor3or4(),
  new Laboratory(),
  new Militia(),
  new Moat(),
  new Smithy(),
  new Witch(),
  new WitchAndMoatFor3or4(),
  new WitchFor3or4(),
  new StatsBot()
];

const start = new Date();
const state = new State();
const player1 = players[players.length - 1];
const rivals = [ player1 ];
const numPlayers = 2;

while (rivals.length < numPlayers) {
  let rival = players[Math.floor(Math.random() * players.length)];
  while (rivals.map(p => p.toString()).indexOf(rival.toString()) > -1) {
    rival = players[Math.floor(Math.random() * players.length)];
  }
  rivals.push(rival);
}

const numGames = 1;
const config = {};
let logFn = console.log;

if (numGames > 1) {
  logFn = () => {};
}

config.log = logFn;
const stats = { ties: 0 };

rivals.forEach(player => {
  stats[player] = 0;
});

for (let i = 0; i < numGames; i++) {
  state.setUp(rivals, config);
  state.startGame();
  state.doGameAnalysis();

  while (!state.isGameOver()) {
    if (state.phase === PHASE_START) {
      logFn(`=== ${state.current.agent}'s turn ${state.current.turnsTaken + 1}`);
    }

    logFn(`${state.phase} phase`);
    state.doPhase();

    if (state.phase === PHASE_CLEANUP) {
      logFn(state.emptyPiles());
    }
  }

  let maxScore = -Infinity;
  let winner = null;

  state.players.forEach(p => {
    let score = 0;
    const deck = {};

    for (let card of p.getDeck()) {
      if (!deck[card]) {
        deck[card] = 0;
      }

      deck[card]++;
      score += card.getVP(p);
    }

    if (score > maxScore) {
      maxScore = score;
      winner = p.agent;
    } else if (score === maxScore) {
      winner = null;
    }

    logFn(`${p.agent} score: ${score}`);
    logFn(deck);
  });

  logFn(`Trashed cards: ${state.trash}`);

  if (winner) {
    stats[winner]++;
  } else {
    stats.ties++;
  }
}

const end = new Date();

if (numGames > 1) {
  console.log(`Played ${numGames} games.`);
  console.log(stats);
}

console.log(`Time elapsed ${(end - start) / 1000} seconds.`);
