import DoubleMoatFor3or4 from '../doubleMoatFor3or4';
import cards from '../../../game/cards';

class MockState {
  constructor(gainsToEndGame) {
    this._gainsToEndGame = gainsToEndGame;
  }

  gainsToEndGame() {
    return this._gainsToEndGame;
  }
}

class MockPlayer {
  constructor(deck) {
    this._deck = deck;
  }

  countInDeck(card) {
    return this._deck[card] || 0;
  }
}

describe('DoubleMoatFor3or4', () => {
  let player;

  beforeEach(() => {
    player = new DoubleMoatFor3or4();
  });

  test('should prioritize Province if Gold is in the deck', () => {
    const state = new MockState(10);
    const my = new MockPlayer({[cards.Gold]: 1});

    expect(player.gainPriority(state, my)).toContain(cards.Province);
  });

  test('should prioritize Duchy if gainsToEndGame is <= 7', () => {
    const state = new MockState(7);
    const my = new MockPlayer({});

    expect(player.gainPriority(state, my)).toContain(cards.Duchy);
  });

  test('should prioritize Estate if gainsToEndGame is <= 3', () => {
    const state = new MockState(3);
    const my = new MockPlayer({});

    expect(player.gainPriority(state, my)).toContain(cards.Estate);
  });

  test('should always prioritize Gold', () => {
    const state = new MockState(10);
    const my = new MockPlayer({});

    expect(player.gainPriority(state, my)).toContain(cards.Gold);
  });

  test('should prioritize Silver if there are no Silvers in the deck', () => {
    const state = new MockState(10);
    const my = new MockPlayer({});

    expect(player.gainPriority(state, my)).toContain(cards.Silver);
  });

  test('should prioritize Moat if fewer than 2 are in the deck', () => {
    const state = new MockState(10);
    const my = new MockPlayer({[cards.Moat]: 1});

    expect(player.gainPriority(state, my)).toContain(cards.Moat);
  });

  test('should not prioritize Moat if 2 or more are in the deck', () => {
    const state = new MockState(10);
    const my = new MockPlayer({[cards.Moat]: 2});

    expect(player.gainPriority(state, my)).not.toContain(cards.Moat);
  });
});