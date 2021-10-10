import Market from '../market';

test('Market card definition', () => {
  const card = new Market();

  expect(card.toString()).toBe('Market');
  expect(card.cost).toBe(5);
  expect(card.actions).toBe(1);
  expect(card.cards).toBe(1);
  expect(card.buys).toBe(1);
  expect(card.coins).toBe(1);
});
