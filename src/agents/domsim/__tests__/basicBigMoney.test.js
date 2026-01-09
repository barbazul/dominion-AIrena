import BasicBigMoney from '../basicBigMoney';
import { DomPlayer } from '../domPlayer';
import cards from '../../../game/cards';
import State from '../../../game/state';

describe('BasicBigMoney', () => {
  let player;
  let state;

  beforeEach(() => {
    player = new BasicBigMoney();
    state = new State();
  });

  test('should extend DomPlayer', () => {
    expect(player).toBeInstanceOf(DomPlayer);
  });

  test('should have correct name', () => {
    expect(player.name).toBe('Basic Big Money');
  });

  test('gainPriority should return correct card priority order', () => {
    const priorities = player.gainPriority(state);

    // Check if the array contains exactly 3 cards
    expect(priorities).toHaveLength(3);

    // Check if the cards are in the correct order
    expect(priorities[0]).toBe(cards.Province);
    expect(priorities[1]).toBe(cards.Gold);
    expect(priorities[2]).toBe(cards.Silver);
  });

  test('gainPriority should return same priority regardless of game state', () => {
    const priorities1 = player.gainPriority(state);
    const priorities2 = player.gainPriority(state);

    // The priorities should be consistent regardless of state
    expect(priorities1).toEqual(priorities2);
  });
});