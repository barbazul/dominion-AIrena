'use strict';

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
import FirstGame from './src/agents/domsim/firstGame';
import State from './src/game/state';
import BureaucratGardens from './src/agents/domsim/bureaucratGardens';
import BurningSkullHTBD1 from './src/agents/domsim/burningSkullHTBD1';
import CouncilRoomMilitia from './src/agents/domsim/councilRoomMilitia';
import { DomPlayer } from './src/agents/domsim/domPlayer';
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
  new Moat()
];

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
let gameCounter = 0;

for (let i = 0; i < players.length - 1; i++) {
  for (let j = i + 1; j < players.length; j++) {
    console.log(`\n`);
    console.log(`${players[i]} vs ${players[j]}`);
    for (let game = 0; game < 10; game++) {
      let state = new State();
      let logFn = () => {};

      try {
        state.setUp([players[i], players[j]], { log: logFn });
      } catch (error) {
        if (error.message === 'Too many required cards') {
          console.log('Impossible match');
          break;
        }
      }
      state.startGame();

      while (!state.isGameOver()) {
        state.doPhase();
      }

      let winner = getWinner(state);
      scoreBoard[players[i]].plays++;
      scoreBoard[players[j]].plays++;

      if (!winner) {
        console.log(`>>> Game is a tie`);
        scoreBoard[players[i]].wins += 0.5;
        scoreBoard[players[j]].wins += 0.5;
      } else {
        console.log(`>>> Winner is ${winner}`);
        scoreBoard[winner].wins++;
      }

      gameCounter++;
    }

    scoreBoard[players[i]].rate = scoreBoard[players[i]].wins / scoreBoard[players[i]].plays;
    scoreBoard[players[j]].rate = scoreBoard[players[j]].wins / scoreBoard[players[j]].plays;
  }
}

console.log(scoreBoard);

const elapsed = new Date().getTime() - start.getTime();
console.log(`Tournament took ${elapsed / 1000} seconds.`);
console.log(`Played ${gameCounter} games (${elapsed / 1000 / gameCounter} seconds per game).`);
