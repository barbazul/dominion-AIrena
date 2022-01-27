import StatsBot from "../statsBot.js";
import State from "../../../game/state.js";
import cards from "../../../game/cards.js";
import BasicAI from "../../basicAI.js";
import BigSmithy from "../../dominiate/bigSmithy";
import BigMoney from "../../dominiate/bigMoney";
import BMLibrary from "../../dominiate/bmLibrary";

const sampleKingdomFull = [
  // I'm pretty sure this specific combination does not match any specific bot
  cards.Moat,    cards.Gardens, cards.Moneylender,
  cards.Chapel,  cards.Witch,   cards.Smithy,
  cards.Artisan, cards.Bandit,  cards.Bureaucrat,
  cards.Village
];

test('doGameAnalysis always sets an actual agent', () => {
  const statsBot = new StatsBot();
  const state = new State();

  state.setUp(
    [ statsBot, statsBot ],
    {
      log: () => {},
      warn: () => {},
      required: sampleKingdomFull
    }
  );

  statsBot.setActualAgent = jest.fn(statsBot.setActualAgent);
  statsBot.doGameAnalysis(state, state.current)

  expect(statsBot.setActualAgent).toHaveBeenCalledWith(expect.any(BasicAI));
});

test('doGameAnalysis skips better bots that don\'t match the requirements', () => {
  const statsBot = new StatsBot();
  const state = new State();

  state.setUp(
    [ statsBot, statsBot ],
    {
      log: () => {},
      warn: () => {},
      required: sampleKingdomFull
    }
  );

  statsBot.setActualAgent = jest.fn(statsBot.setActualAgent);
  statsBot.agents = [ new BigMoney(), new BigSmithy(), new BMLibrary() ];
  statsBot.stats = {
    // Worst always available as it has no requirements
    BigMoney: { plays: 10, wins: 3, rate: 0.3 },

    // 2nd Best. Should be selected as there is Smithy in required cards
    'Big Smithy': { plays: 10, wins: 5, rate: 0.5 },

    // Best, should be skipped as there is no Library in kingdom
    'BM Library': { plays: 10, wins: 9, rate: 0.9 },
  }

  statsBot.doGameAnalysis(state, state.current)

  expect(statsBot.setActualAgent).toHaveBeenCalledWith(expect.any(BigSmithy));
});

test('doGameAnalysis skips bots with no stats', () => {
  const statsBot = new StatsBot();
  const state = new State();

  state.setUp(
    [ statsBot, statsBot ],
    {
      log: () => {},
      warn: () => {},
      required: sampleKingdomFull
    }
  );

  statsBot.setActualAgent = jest.fn(statsBot.setActualAgent);
  statsBot.agents = [ new BigMoney(), new BasicAI() ];

  statsBot.stats = {
    // Worst always available as it has no requirements
    BasicAI: { plays: 10, wins: 0, rate: 0 },
  }

  statsBot.doGameAnalysis(state, state.current)

  expect(statsBot.setActualAgent).toHaveBeenCalledWith(expect.any(BasicAI));
});
