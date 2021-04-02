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
  new FirstGame(),
  new MoneylenderWitch(),
  new LabMilitiaChapel(), // 13
  new Festival(),
  new SingleWitch(),
  new CouncilRoom(),
  new Bureaucrat(),
  new BigMoneyUltimate(), // 18
  new WorkshopGardens(),
  new BasicBigMoney(),
  new BigMoneyUltimateFor3or4(),
  new DoubleMoatFor3or4(),
  new Laboratory(),
  new Militia(),
  new Moat(),
  new Smithy()
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

state.setUp(rivals);

console.log(state.kingdom);

state.startGame();

while (!state.isGameOver()) {
  if (state.phase === PHASE_START) {
    console.log(`=== ${state.current.agent}'s turn ${state.current.turnsTaken + 1}`);
  }

  console.log(`${state.phase} phase`);
  state.doPhase();

  if (state.phase === PHASE_CLEANUP) {
    console.log(state.emptyPiles());
  }
}

const end = new Date();

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

  console.log(`${p.agent} score: ${score}`);
  console.log(deck);
});

console.log(`Time elapsed ${(end - start) / 1000} seconds.`);
