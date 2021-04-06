import BasicAI from './src/agents/basicAI';
import BigMoney from './src/agents/dominiate/bigMoney';
import BigSmithy from './src/agents/dominiate/bigSmithy';
import BMLibrary from './src/agents/dominiate/bmLibrary';
import ChapelWitch from './src/agents/dominiate/chapelWitch';
import DoubleMilitia from './src/agents/dominiate/doubleMilitia';
import DoubleWitch from './src/agents/dominiate/doubleWitch';
import MoneylenderWitch from './src/agents/dominiate/moneylenderWitch';
import SillyAI from './src/agents/dominiate/sillyAI';
import SingleWitch from './src/agents/dominiate/singleWitch';
import BureaucratGardens from './src/agents/domsim/bureaucratGardens';
import CouncilRoomMilitia from './src/agents/domsim/councilRoomMilitia';
import FirstGame from './src/agents/domsim/firstGame';
import BurningSkullHTBD1 from './src/agents/domsim/burningSkullHTBD1';
import State, { PHASE_CLEANUP, PHASE_START } from './src/game/state';
import LabMilitiaChapel from './src/agents/domsim/labMilitiaChapel';
import Festival from './src/agents/domsim/festival';
import CouncilRoom from './src/agents/domsim/councilRoom';
import Bureaucrat from './src/agents/domsim/bureaucrat';
import BigMoneyUltimate from './src/agents/domsim/bigMoneyUltimate';
import WorkshopGardens from './src/agents/domsim/workshopGardens';
import BasicBigMoney from './src/agents/domsim/basicBigMoney';
import BigMoneyUltimateFor3or4 from './src/agents/domsim/bigMoneyUltimateFor3or4';
import DoubleMoatFor3or4 from './src/agents/domsim/doubleMoatFor3or4';
import Laboratory from './src/agents/domsim/laboratory';
import Militia from './src/agents/domsim/militia';
import Moat from './src/agents/domsim/moat';
import Smithy from './src/agents/domsim/smithy';
import Witch from './src/agents/domsim/witch';
import WitchAndMoatFor3or4 from './src/agents/domsim/witchAndMoatFor3or4';

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
  new WitchAndMoatFor3or4()
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

const numGames = 1000;
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
