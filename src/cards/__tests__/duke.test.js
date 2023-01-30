import cards from '../../game/cards.js';
import Duke from '../duke.js';
import Player from '../../game/player.js';
import BasicAI from '../../agents/basicAI.js';

test('Duke card definition', () => {
  const card = new Duke();

  expect(card.toString()).toBe('Duke');
  expect(card.cost).toBe(5);
});

test('getVP returns 0 on empty deck', () => {
  const card = new Duke();
  const player = new Player(new BasicAI(), () => {});

  player.getDeck = () => [];

  expect(card.getVP(player)).toBe(0);
});

test('getVP returns 1 vp per Duchy', () => {
  const card = new Duke();
  const player = new Player(new BasicAI(), () => {});

  expect(card.getVP(player)).toBe(0);

  player.draw.push(cards.Duchy);
  expect(card.getVP(player)).toBe(1);

  player.draw.push(cards.Duchy);
  expect(card.getVP(player)).toBe(2);

  player.discard.push(cards.Duchy);
  expect(card.getVP(player)).toBe(3);
});
