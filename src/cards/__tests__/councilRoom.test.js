import BasicAI from '../../agents/basicAI';
import State from '../../game/state';
import Card from '../card';
import CouncilRoom from '../councilRoom';

test('Council Room card definition', () => {
  const card = new CouncilRoom();

  expect(card.toString()).toBe('Council Room');
  expect(card.cost).toBe(5);
  expect(card.cards).toBe(4);
  expect(card.buys).toBe(1);
});

test('playEffect causes other players to draw a card', () => {
  const card = new CouncilRoom();
  const state = new State();

  state.setUp([new BasicAI(), new BasicAI()]);
  state.players[0].drawCards = jest.fn(() => {});
  state.players[1].drawCards = jest.fn(() => {});

  card.playEffect(state);

  expect(state.players[0].drawCards).not.toHaveBeenCalled();
  expect(state.players[1].drawCards).toHaveBeenCalledWith(1);
});
