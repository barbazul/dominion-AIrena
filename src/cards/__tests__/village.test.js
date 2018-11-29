import Village from '../village';

test('Village card definition', () => {
  const card = new Village();

  expect(card.cost).toBe(3);
  expect(card.actions).toBe(2);
  expect(card.cards).toBe(1);
});
