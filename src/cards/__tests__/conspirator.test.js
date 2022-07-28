import Conspirator from '../conspirator.js';

test('Conspirator card definition', () => {
  const card = new Conspirator();

  expect(card.toString()).toBe('Conspirator');
  expect(card.cost).toBe(4);
  expect(card.coins).toBe(2);
});
