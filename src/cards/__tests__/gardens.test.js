import BasicAI from '../../agents/basicAI';
import Player from '../../game/player';
import Gardens from '../gardens';

test('Gardens card definition', () => {
  const card = new Gardens();

  expect(card.toString()).toBe('Gardens');
  expect(card.cost).toBe(4);
});

test('getVP returns 0 on empty deck', () => {
  const card = new Gardens();
  const player = new Player(new BasicAI(), () => {});

  player.getDeck = () => [];

  expect(card.getVP(player)).toBe(0);
});

test('getVP returns 1/10 of the cards in the deck rounding down', () => {
  const card = new Gardens();
  const player = new Player(new BasicAI(), () => {});

  // 21 cards in deck
  player.getDeck = () => [
    card, card, card, card, card, card, card, card, card, card,
    card, card, card, card, card, card, card, card, card, card,
    card
  ];

  expect(card.getVP(player)).toBe(2);
});
