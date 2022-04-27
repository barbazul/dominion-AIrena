import Laboratory from '../laboratory';

test('Laboratory card  definition', () => {
  const card = new Laboratory();
  expect(card.toString()).toBe('Laboratory');
  expect(card.cost).toBe(5);
  expect(card.actions).toBe(1);
  expect(card.cards).toBe(2);
});
