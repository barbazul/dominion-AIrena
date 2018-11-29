import BasicAction from '../basicAction';

test('Basic Action is an action', () => {
  const card = new BasicAction();

  expect(card.isAction()).toBe(true);
});
