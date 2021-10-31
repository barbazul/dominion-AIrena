import MiningVillage from '../miningVillage.js';

test('Mining Village card definition', () => {
  const card = new MiningVillage();

  expect(card.toString()).toBe('Mining Village');
  expect(card.cost).toBe(4);
  expect(card.actions).toBe(2);
  expect(card.cards).toBe(1);
});
