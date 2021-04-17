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
import Smithy from './src/agents/domsim/smithy';
import Witch from './src/agents/domsim/witch';
import WitchAndMoatFor3or4 from './src/agents/domsim/witchAndMoatFor3or4';
import WitchFor3or4 from './src/agents/domsim/witchFor3or4';
import ProxyAgent from './src/agents/proxyAgent';

const proxyMilitia = new ProxyAgent();
const proxySillyAI = new ProxyAgent();
const proxyWitch = new ProxyAgent();

proxyMilitia.setActualAgent(new Militia());
proxyMilitia.name = 'Proxy Militia';
proxyMilitia.requires = proxyMilitia.getActualAgent().requires

proxySillyAI.setActualAgent(new SillyAI());
proxySillyAI.name = 'Proxy SillyAI';
proxySillyAI.requires = proxySillyAI.getActualAgent().requires

proxyWitch.setActualAgent(new Witch());
proxyWitch.name = 'Proxy Witch';
proxyWitch.requires = proxyWitch.getActualAgent().requires

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
  proxyMilitia,
  proxyWitch,
  proxySillyAI
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
    for (let game = 0; game < 10; game++) {
      let state = new State();
      let logFn = () => {};

      try {
        state.setUp([players[i], players[j]], { log: logFn });
      } catch (error) {
        if (error.message === 'Too many required cards') {
          console.log(`Impossible match ${players[i]} vs ${players[j]}`);
          break;
        }
      }

      console.log(`${players[i]} vs ${players[j]}`);
      state.startGame();

      while (!state.isGameOver()) {
        state.doPhase();
      }

      let winner = getWinner(state);
      scoreBoard[players[i]].plays++;
      scoreBoard[players[j]].plays++;

      if (!winner) {
        scoreBoard[players[i]].wins += 0.5;
        scoreBoard[players[j]].wins += 0.5;
      } else {
        scoreBoard[winner].wins++;
      }

      gameCounter++;
    }

    scoreBoard[players[i]].rate = scoreBoard[players[i]].wins / scoreBoard[players[i]].plays;
    scoreBoard[players[j]].rate = scoreBoard[players[j]].wins / scoreBoard[players[j]].plays;
  }
}

let ranking = [];
for (let p in scoreBoard) {
  ranking.push({
    player: p,
    score: scoreBoard[p].rate
  });
}

ranking.sort((p1, p2) => p2.score - p1.score);

console.log(ranking);

const elapsed = new Date().getTime() - start.getTime();
console.log(`Tournament took ${elapsed / 1000} seconds.`);
console.log(`Played ${gameCounter} games (${Math.round(elapsed / gameCounter)} ms per game).`);
