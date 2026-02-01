import Festival from '../festival';
import cards from '../../../game/cards';

class MockState {
  constructor(provinceCount) {
    this._provinceCount = provinceCount;
  }

  countInSupply(card) {
    return card === cards.Province ? this._provinceCount : 0;
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

describe('Festival', () => {
  let player;

  beforeEach(() => {
    player = new Festival();
  });

  test('should prioritize Province if Gold is in the deck', () => {
    const state = new MockState(8);
    const my = new MockPlayer({[cards.Gold]: 1});

    expect(player.gainPriority(state, my)).toContain(cards.Province);
  });

  test('should not prioritize Province if no Gold in the deck', () => {
    const state = new MockState(8);
    const my = new MockPlayer({});

    expect(player.gainPriority(state, my)).not.toContain(cards.Province);
  });

  test('should prioritize Duchy if Province count <= 4', () => {
    const state = new MockState(4);
    const my = new MockPlayer({});

    expect(player.gainPriority(state, my)).toContain(cards.Duchy);
  });

  test('should prioritize Estate if Province count <= 2', () => {
    const state = new MockState(2);
    const my = new MockPlayer({});

    expect(player.gainPriority(state, my)).toContain(cards.Estate);
  });

  test('should always prioritize Gold', () => {
    const state = new MockState(8);
    const my = new MockPlayer({});

    expect(player.gainPriority(state, my)).toContain(cards.Gold);
  });

  test('should prioritize Festival', () => {
    const state = new MockState(8);
    const my = new MockPlayer({});

    expect(player.gainPriority(state, my)).toContain(cards.Festival);
  });

  test('should prioritize Silver', () => {
    const state = new MockState(8);
    const my = new MockPlayer({});

    expect(player.gainPriority(state, my)).toContain(cards.Silver);
  });

  test('should prioritize Duchy if Province count <= 6', () => {
    const state = new MockState(6);
    const my = new MockPlayer({});

    expect(player.gainPriority(state, my)).toContain(cards.Duchy);
  });
});
