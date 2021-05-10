import BasicAI from '../../agents/basicAI';
import Card from '../../cards/card';
import cards from '../cards';
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

test('getDeck returns cards in every possible location', () => {
  const player = new Player(new BasicAI(), () => {});
  const cardInDraw = new Card();
  const cardInDiscard = new Card();
  const cardInHand = new Card();
  const cardInPlay = new Card();

  cardInDraw.name = 'Card in Draw';
  cardInDiscard.name = 'Card in Discard';
  cardInHand.name = 'Card in hand';
  cardInPlay.name = 'Card in Play';

  player.draw = [cardInDraw];
  player.discard = [cardInDiscard];
  player.hand = [cardInHand];
  player.inPlay = [cardInPlay];

  expect(player.getDeck()).toContain(cardInDraw);
  expect(player.getDeck()).toContain(cardInDiscard);
  expect(player.getDeck()).toContain(cardInHand);
  expect(player.getDeck()).toContain(cardInPlay);
});

test('countInDeck returns the number of copies of a card', () => {
  const player = new Player(new BasicAI(), () => {});

  player.getDeck = jest.fn(
    () => [
      cards.Copper, cards.Estate, cards.Copper, cards.Estate, cards.Copper, cards.Estate, cards.Copper, cards.Copper,
      cards.Copper, cards.Copper
    ]
  );

  expect(player.countInDeck(cards.Copper)).toBe(7);
});

test('countInDeck works with strings', () => {
  const player = new Player(new BasicAI(), () => {});

  player.getDeck = jest.fn(
    () => [
      cards.Copper, cards.Estate, cards.Copper, cards.Estate, cards.Copper, cards.Estate, cards.Copper, cards.Copper,
      cards.Copper, cards.Copper
    ]
  );

  expect(player.countInDeck('Estate')).toBe(3);
});

test('numCardsInDeck returns the number of cards in players deck', () => {
  const player = new Player(new BasicAI(), () => {});

  player.getDeck = jest.fn(() => [new Card(), new Card(), new Card()]);
  expect(player.numCardsInDeck()).toBe(3);
});

test('countInHand returns the number of copies of a card in players hand', () => {
  const player = new Player(new BasicAI(), () => {});
  const card1 = new Card();
  const card2 = new Card();

  card1.name = 'A Card';
  card2.name = 'Another Card';

  player.hand = [card1, card2, card1];
  expect(player.countInHand(card1)).toBe(2);
});

test('countInHand works with strings', () => {
  const player = new Player(new BasicAI(), () => {});
  const card1 = new Card();
  const card2 = new Card();

  card1.name = 'A Card';
  card2.name = 'Another Card';

  player.hand = [card1, card2, card1];
  expect(player.countInHand('A Card')).toBe(2);
});

test('countInPlay returns the number of copies of a card in play', () => {
  const player = new Player(new BasicAI(), () => {});
  const card1 = new Card();
  const card2 = new Card();
  let count;

  card1.name = 'A Card';
  card2.name = 'Another Card';

  player.inPlay = [card1, card2, card1];
  player.hand = [card1];
  player.countInStack = jest.fn(() => 2);
  count = player.countInPlay(card1);

  expect(player.countInStack).toHaveBeenCalledWith(card1, player.inPlay);
  expect(count).toBe(2);
});

test('countPlayed returns the number of times a card was played', () => {
  const player = new Player(new BasicAI(), () => {});
  const card1 = new Card();
  const card2 = new Card();
  let count;

  card1.name = 'A Card';
  card2.name = 'Another Card';

  player.cardsPlayed = [card1, card2, card1];
  player.countInStack = jest.fn(() => 2);
  count = player.countPlayed(card1);

  expect(player.countInStack).toHaveBeenCalledWith(card1, player.cardsPlayed);
  expect(count).toBe(2);
});

test('getTotalMoney sums all treasures and cantrips', () => {
  const player = new Player(new BasicAI(), () => {});
  const cantrip = new Card();

  cantrip.actions = 1;
  cantrip.coins = 2;
  player.getDeck = () => [cards.Copper, cards.Silver, cantrip];
  expect(player.getTotalMoney()).toBe(5);
});

test('getTotalMoney excludes oher cards', () => {
  const player = new Player(new BasicAI(), () => {});
  const cantrip = new Card();
  const terminal = new Card();

  cantrip.actions = 1;
  cantrip.coins = 2;
  terminal.actions = 0;
  terminal.coins = 2;

  player.getDeck = () => [cards.Copper, cards.Silver, cantrip, terminal];
  expect(player.getTotalMoney()).toBe(5);
});

test('getTreasureInHand returns the sum of coins generated by cards in hand', () => {
  const player = new Player(new BasicAI(), () => {});

  player.hand = [cards.Copper, cards.Silver, cards.Gold];
  expect(player.getTreasureInHand()).toBe(6);
});

test('getTreasureInHand only counts treasures', () => {
  const player = new Player(new BasicAI(), () => {});

  player.hand = [cards.Copper, cards.Silver, cards.Gold, cards.Market];
  expect(player.getTreasureInHand()).toBe(6);
});

test('getAvailableMoney adds accumulated coins and treasures in hand', () => {
  const player = new Player(new BasicAI(), () => {});

  player.hand = [cards.Copper, cards.Silver, cards.Gold, cards.Market];
  player.coins = 2;
  expect(player.getAvailableMoney()).toBe(8);
});

test('countPlayableTerminals return the current actions when hand is empty', () => {
  const player = new Player(new BasicAI(), () => {});

  player.hand = [];
  player.actions = 5;
  expect(player.countPlayableTerminals()).toBe(5);
});

test('countPlayableTerminals accounts for villages in hand when available', () => {
  const player = new Player(new BasicAI(), () => {});
  const village = new Card();
  const cantrip = new Card();
  const terminal = new Card();

  village.actions = 2;
  cantrip.actions = 1;
  terminal.actions = 0;
  player.hand = [village, cantrip, terminal];
  player.actions = 5;
  expect(player.countPlayableTerminals()).toBe(6);
});

test('Topdeck cards puts cards at the begining of draw pile', () => {
  const player = new Player(new BasicAI(), () => {});

  player.draw = [ cards.Curse ];
  player.topdeck([ cards.Copper, cards.Silver ]);

  expect(player.draw).toEqual([ cards.Copper, cards.Silver, cards.Curse ]);
});

test('Topdecked cards are known', () => {
  const player = new Player(new BasicAI(), () => {});

  player.topdeck([ cards.Copper, cards.Silver ]);

  expect(player.knownTopCards).toEqual(2);
});

test('getCardsFromDeck reduces knownTopCards', () => {
  const player = new Player(new BasicAI(), () => {});

  player.knownTopCards = 2;
  player.getCardsFromDeck(1);

  expect(player.knownTopCards).toEqual(1);
});

test('actionBalance returns remaining actions with empty hand', () => {
  const player = new Player(new BasicAI(), () => {});

  player.actions = 2;
  player.hand = [];

  expect(player.actionBalance()).toEqual(2);
});

test('actionBalance totals potential actions gained from cards in hand', () => {
  const player = new Player(new BasicAI(), () => {});

  player.actions = 1;
  player.hand = [ cards.Village, cards.Village ];
  expect(player.actionBalance()).toEqual(3);
});

test('actionBalance skips non-action cards', () => {
  const player = new Player(new BasicAI(), () => {});
  player.actions = 1;
  player.hand = [ cards.Village, cards.Gold ];
  expect(player.actionBalance()).toEqual(2);
});

test('countTypeInDeck counts correctly', () => {
  const player = new Player(new BasicAI(), () => {});
  player.draw = [ cards.Village, cards.Smithy ];
  player.hand = [];
  player.discard = [];
  expect(player.countTypeInDeck('Action')).toEqual(2);
});

test('getActionDensity', () => {
  const player = new Player(new BasicAI(), () => {});
  player.draw = [ cards.Village, cards.Copper ];
  player.hand = [];
  player.discard = [];
  expect(player.getActionDensity()).toEqual(0.5);
});

test('actionBalance considers dead draws from terminals', () => {
  const player = new Player(new BasicAI(), () => {});

  player.actions = 1;
  player.draw = [ cards.Smithy, cards.Smithy, cards.Smithy ];
  player.hand = [ cards.Village, cards.Smithy ];
  player.discard = [];
  expect(player.actionBalance()).toEqual(-2);
});

test('copy creates a new Player instance', () => {
  const player = new Player(new BasicAI(), () => {});

  expect(player.copy()).toBeInstanceOf(Player);
});

test('Copied Player has same stuff', () => {
  const player = new Player(new BasicAI(), () => {});
  let newPlayer;

  player.actions = 3;
  player.buys = 4;
  player.coins = 5;
  newPlayer = player.copy();

  expect(newPlayer.actions).toEqual(player.actions);
  expect(newPlayer.buys).toEqual(player.buys);
  expect(newPlayer.coins).toEqual(player.coins);
});
