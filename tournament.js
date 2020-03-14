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

const players = [
  new BasicAI(),
  new BigMoney(),
  new BigSmithy(),
  new BMLibrary(),
  new ChapelWitch(),
  new DoubleMilitia(),
  new DoubleWitch(),
  new MoneylenderWitch(),
  new SillyAI(),
  new SingleWitch(),
  new FirstGame()
];

for (let i = 0; i < players.length - 1; i++) {
  for (let j = i + 1; j < players.length; j++) {
    console.log(`${players[i]} vs ${players[j]}`);
    let state = new State();
    state.setUp([players[i], players[j]]);
    state.startGame();

    while (!state.isGameOver()) {
      state.doPhase();
    }
  }
}
