import Festival from '../festival';

test('Festival card  definition', () => {
  const card = new Festival();
  expect(card.toString()).toBe('Festival');
  expect(card.cost).toBe(5);
  expect(card.actions).toBe(2);
  expect(card.buys).toBe(1);
  expect(card.coins).toBe(2);
});
