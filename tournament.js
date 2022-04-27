'use strict';

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
import FirstGame from './src/agents/domsim/firstGame.js';
import State from './src/game/state.js';
import BureaucratGardens from './src/agents/domsim/bureaucratGardens.js';
import BurningSkullHTBD1 from './src/agents/domsim/burningSkullHTBD1.js';
import CouncilRoomMilitia from './src/agents/domsim/councilRoomMilitia.js';
import { DomPlayer } from './src/agents/domsim/domPlayer.js';
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
import SingleBaron from './src/agents/dominiate/singleBaron.js';
import StatsBot from './src/agents/barbazul/StatsBot.js';
import ObmBridge from './src/agents/dominiate/obmBridge.js';
import Artisan from './src/agents/barbazul/artisan.js';
import yargs from 'yargs';
import * as fs from 'fs';

const argv = yargs(process.argv.slice(2))
  .option('statsbot-stats-file', {
    type: 'string'
  })
  .option('update-stats-file', {
    type: 'string'
  }).argv;

const statsBotOptions = {};

if (argv['statsbot-stats-file']) {
  statsBotOptions.statsFile = argv['statsbot-stats-file'];
}

const players = [
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
  new Artisan(),
  new SingleBaron(),
  new ObmBridge()
];

const statsBotAgent = new StatsBot(statsBotOptions);

players.push(statsBotAgent);

let scoreBoard = Object.fromEntries(players.map(p => [ p.toString(), { plays: 0, wins: 0, rate: 0.0 } ]));

function getWinner (state) {
  const scores = [];
  const agents = [];
  let winner;
  let highScore = -Infinity;

  state.players.forEach((p, i) => {
    let score = 0;
    const deck = {};

    for (let card of p.getDeck()) {
      if (!deck[card]) {
        deck[card] = 0;
      }

      deck[card]++;
      score += card.getVP(p);
    }

    scores[i] = score;
    agents[i] = p.agent.toString();
  });

  // hack the ties (only 2p)
  if (scores[0] === scores[1]) {
    return null;
  }

  for (let i = 0; i < scores.length; i++) {
    if (scores[i] > highScore) {
      winner = agents[i];
      highScore = scores[i];
    }
  }

  return winner;
}

const start = new Date();
const gamesPerMatch = 10;
let gameCounter = 0;

for (let i = 0; i < players.length - 1; i++) {
  for (let j = i + 1; j < players.length; j++) {
    for (let game = 0; game < gamesPerMatch; game++) {
      let state = new State();
      let logFn = () => {};

      if (players[i].toString() === 'SillyAI' || players[j].toString() === 'SillyAI') {
        logFn = console.log;
      }

      if (game === 0) {
        console.log(`${players[i]} vs ${players[j]}`);
      }

      try {
        state.setUp([players[i], players[j]], { log: logFn });
      } catch (error) {
        if (error.message === 'Too many required cards') {
          console.log(`Impossible match ${players[i]} vs ${players[j]}`);
          break;
        }

        console.log(error);
      }

      state.startGame();
      state.doGameAnalysis();

      while (!state.isGameOver()) {
        state.doPhase();
      }

      let winner = getWinner(state);
      scoreBoard[players[i]].plays++;
      scoreBoard[players[j]].plays++;

      if (!winner) {
        scoreBoard[players[i]].wins += 0.5;
        scoreBoard[players[j]].wins += 0.5;
        if (players[i] === statsBotAgent || players[j] === statsBotAgent) {
          statsBotAgent.recordResult(0.5);
        }
      } else {
        scoreBoard[winner].wins++;
        if (players[i] === statsBotAgent || players[j] === statsBotAgent) {
          statsBotAgent.recordResult(Number(winner === statsBotAgent));
        }
      }

      gameCounter++;
    }

    scoreBoard[players[i]].rate = scoreBoard[players[i]].wins / scoreBoard[players[i]].plays;
    scoreBoard[players[j]].rate = scoreBoard[players[j]].wins / scoreBoard[players[j]].plays;
  }
}

const elapsed = new Date().getTime() - start.getTime();

let ranking = [];
for (let p in scoreBoard) {
  ranking.push({
    player: p,
    score: scoreBoard[p].rate
  });
}

statsBotAgent.saveStats();

ranking.sort((p1, p2) => p2.score - p1.score);

console.log(scoreBoard);
console.log(ranking);

console.log(`Tournament took ${elapsed / 1000} seconds.`);
console.log(`Played ${gameCounter} games (${Math.round(elapsed / gameCounter)} ms per game).`);

if (argv['update-stats-file']) {
  console.log(`Saving stats to ${argv['update-stats-file']}`);
  let stats = {};

  if (fs.existsSync(argv['update-stats-file'])) {
    stats = JSON.parse(fs.readFileSync(argv['update-stats-file'], { encoding: 'utf8' }));
  }

  for (let p in scoreBoard) {
    if (!stats[p]) {
      stats[p] = scoreBoard[p];
    } else {
      stats[p].wins += scoreBoard[p].wins;
      stats[p].plays += scoreBoard[p].plays;
      stats[p].rate = stats[p].wins / stats[p].plays;
    }
  }

  fs.writeFileSync(argv['update-stats-file'], JSON.stringify(stats), { encoding: 'utf8' });
}
