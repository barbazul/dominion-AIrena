import Smithy from '../smithy';

test('Smithy card definition', () => {
  const card = new Smithy();

  expect(card.toString()).toBe('Smithy');
  expect(card.cost).toBe(4);
  expect(card.cards).toBe(3);
});
