import BasicAI from '../../agents/basicAI';
import Card from '../../cards/card';
import Player from '../player';

test('Initial state', () => {
  const basicAI = new BasicAI();
  const log = console.log;
  const player = new Player(basicAI, log);

  expect(player.agent).toBe(basicAI);
  expect(player.log).toBe(log);
  expect(player.actions).toBe(1);
  expect(player.buys).toBe(1);
  expect(player.coins).toBe(0);
  expect(player.hand).toHaveLength(0);
  expect(player.discard).toHaveLength(10);
  expect(player.draw).toHaveLength(0);
  expect(player.inPlay).toHaveLength(0);
  expect(player.turnsTaken).toBe(0);
});

test('Draw cards returns empty with no deck or discard', () => {
  const basicAI = new BasicAI();
  const log = () => {};
  const player = new Player(basicAI, log);
  let drawn;

  player.hand = [];
  player.draw = [];
  player.discard = [];
  drawn = player.drawCards(1);

  expect(drawn).toHaveLength(0);
  expect(player.hand).toHaveLength(0);
  expect(player.discard).toHaveLength(0);
  expect(player.draw).toHaveLength(0);
});

test('Draw cards with enough cards in deck', () => {
  const basicAI = new BasicAI();
  const log = () => {};
  const player = new Player(basicAI, log);
  const card1 = new Card();
  const card2 = new Card();
  let drawn;

  player.hand = [];
  player.draw = [card1, card2];
  player.discard = [];
  drawn = player.drawCards(1);

  expect(drawn).toHaveLength(1);
  expect(player.hand).toHaveLength(1);
  expect(player.discard).toHaveLength(0);
  expect(player.draw).toHaveLength(1);
});

test('Draw more cards than owned ignores extra cards (overdraw)', () => {
  const basicAI = new BasicAI();
  const log = () => {};
  const player = new Player(basicAI, log);
  const card1 = new Card();
  const card2 = new Card();
  let drawn;

  player.hand = [];
  player.draw = [card1, card2];
  player.discard = [];
  drawn = player.drawCards(3);

  expect(drawn).toHaveLength(2);
  expect(player.hand).toHaveLength(2);
  expect(player.discard).toHaveLength(0);
  expect(player.draw).toHaveLength(0);
});

test('Shuffle single card in discard into empty draw pile', () => {
  const basicAI = new BasicAI();
  const player = new Player(basicAI, () => {}, () => 0.5);
  const card1 = new Card();

  player.discard = [card1];
  player.draw = [];
  player.shuffle();

  expect(player.discard).toHaveLength(0);
  expect(player.draw).toEqual([card1]);
});

test('Shuffle discard into empty draw pile', () => {
  const basicAI = new BasicAI();
  const player = new Player(basicAI, () => {}, () => 0.5);
  const card1 = new Card();
  const card2 = new Card();
  const card3 = new Card();

  card1.name = 'Card 1';
  card2.name = 'Card 2';
  card3.name = 'Card 3';
  player.discard = [card1, card2, card3];
  player.draw = [];

  player.shuffle();

  expect(player.discard).toHaveLength(0);
  expect(player.draw).toEqual([card3, card1, card2]);
});

test('Shuffle discard into non empty draw pile', () => {
  const basicAI = new BasicAI();
  const player = new Player(basicAI, () => {}, () => 0.5);
  const card1 = new Card();
  const card2 = new Card();
  const card3 = new Card();
  const card4 = new Card();

  card1.name = 'Card 1';
  card2.name = 'Card 2';
  card3.name = 'Card 3';
  card4.name = 'Card 4';
  player.discard = [card1, card2, card3];
  player.draw = [card4];

  player.shuffle();

  expect(player.discard).toHaveLength(0);
  expect(player.draw).toEqual([card4, card3, card1, card2]);
});

test('Draw more than draw causes shuffle', () => {
  const basicAI = new BasicAI();
  const log = () => {};
  const player = new Player(basicAI, log, () => 0.5);
  const card1 = new Card();
  const card2 = new Card();
  const card3 = new Card();
  const card4 = new Card();
  let drawn;

  player.hand = [];
  player.draw = [card4];
  player.discard = [card1, card2, card3];
  drawn = player.drawCards(3);

  expect(drawn).toHaveLength(3);
  expect(player.hand).toHaveLength(3);
  expect(player.discard).toHaveLength(0);
  expect(player.draw).toHaveLength(1);
  expect(player.hand).toEqual([card4, card3, card2]);
});