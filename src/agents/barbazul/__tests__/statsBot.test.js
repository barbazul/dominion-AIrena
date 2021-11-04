import StatsBot from "../statsBot.js";
import State from "../../../game/state.js";
import cards from "../../../game/cards.js";
import BasicAI from "../../basicAI.js";

test('doGameAnalysis always sets an actual agent', () => {
  const statsBot = new StatsBot();
  const state = new State();

  state.setUp(
    [ statsBot, statsBot ],
    {
      log: () => {},
      warn: () => {},
      required: [
        // I'm pretty sure this specific combination does not match any specific bot
        cards.Bridge, cards.Moat, cards.Gardens, cards.Moneylender,
        cards.Chapel, cards.Witch, cards.Smithy, cards.Artisan,
        cards.Bandit, cards.Bureaucrat
      ]
    }
  );
  statsBot.setActualAgent = jest.fn(statsBot.setActualAgent);
  statsBot.doGameAnalysis(state, state.current)
  // expect(statsBot.setActualAgent).toHaveBeenCalledWith(expect.objectContaining({choose: expect.any(Function)}));
  expect(statsBot.setActualAgent).toHaveBeenCalledWith(expect.any(BasicAI));
});