import BasicAttack from '../basicAttack';

test('Basic Attack is an action and an attack', () => {
  const card = new BasicAttack();

  expect(card.isAction()).toBe(true);
  expect(card.isAttack()).toBe(true);
});
