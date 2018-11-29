import BasicAI from '../../agents/basicAI';
import State from '../../game/state';
import Chapel from '../chapel';

test('Chapel card definition', () => {
  const card = new Chapel();

  expect(card.cost).toBe(2);
});

test('Play effect allows trash 4', () => {
  const card = new Chapel();
  const state = new State();
  const allowTrashMock = jest.fn(() => []);

  state.allowTrash = allowTrashMock;
  state.setUp([ new BasicAI(), new BasicAI() ], { log: () => {} });
  card.playEffect(state);
  expect(allowTrashMock).toHaveBeenCalledWith(state.current, 4);
});
