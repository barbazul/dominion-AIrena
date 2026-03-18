import FirstGame from '../firstGame';
import cards from "../../../game/cards.js";
import {PHASE_ACTION, PHASE_BUY} from "../../../game/state.js";

describe('FirstGame Class', () => {

  let firstGame;
  let mockState;
  let mockPlayer;

  beforeEach(() => {
    firstGame = new FirstGame();
    mockState = {
      players: [],
      phase: 'PHASE_ACTION',
      countInSupply: jest.fn()
    };
    mockPlayer = {
      countInDeck: jest.fn(),
      countInHand: jest.fn(),
      getDeck: jest.fn().mockReturnValue([]),
      countCardTypeInDeck: jest.fn(),
      turnsTaken: 0,
      coins: 0,
      buys: 1
    };
  });

  test('should initialize with correct settings', () => {
    expect(firstGame.name).toBe('First Game by michaeljb');
    expect(firstGame.requires).toEqual([
      cards.Smithy, cards.Cellar, cards.Mine, cards.Market, cards.Remodel, cards.Village, cards.Workshop, cards.Militia
    ]);
  });

  test('gainPriority returns correct priorities when phase is ACTION', () => {
    mockState.phase = PHASE_ACTION;
    mockPlayer.countInDeck.mockImplementation(card => (card === cards.Gold ? 1 : 0));
    mockPlayer.countCardTypeInDeck.mockReturnValue(0);

    const priority = firstGame.gainPriority(mockState, mockPlayer);

    expect(priority).toEqual(expect.arrayContaining([cards.Gold, cards.Silver, null]));
    expect(priority).not.toEqual(expect.arrayContaining([cards.Cellar]));
  });

  test('gainPriority returns priority including Cellar under specific conditions', () => {
    mockState.phase = 'PHASE_ACTION';
    mockPlayer.countInDeck.mockImplementation(card => (card === cards.Cellar ? 0 : 2));
    mockPlayer.countCardTypeInDeck.mockReturnValue(4);

    const priority = firstGame.gainPriority(mockState, mockPlayer);

    expect(priority).toEqual(expect.arrayContaining([cards.Cellar, null]));
  });

  test('gainPriority adds Village and Mine on first turns', () => {
    mockPlayer.turnsTaken = 1;
    mockPlayer.countInDeck.mockImplementation(card => (card === cards.Market ? 1 : 0));

    const priority = firstGame.gainPriority(mockState, mockPlayer);

    expect(priority).toEqual(expect.arrayContaining(['Mine', 'Remodel', 'Village', null]));
  });

  test('gainPriority includes Duchy when supply is low', () => {
    mockState.phase = 'BUY_PHASE';
    mockState.countInSupply.mockImplementation(card => (card === 'Province' ? 2 : 10));
    mockPlayer.countInDeck.mockReturnValueOnce(1); // Province count
    mockPlayer.countVP = jest.fn(() => 30);
    mockPlayer.countMaxOpponentVP = jest.fn(() => 40);

    const priority = firstGame.gainPriority(mockState, mockPlayer);

    expect(priority).toEqual(expect.arrayContaining(['Duchy', null]));
  });

  test('gainPriority wants a first market if there is none in the deck', () => {
    mockState.phase = PHASE_ACTION;
    mockPlayer.countInDeck.mockReturnValue(0);
    mockPlayer.countVP = jest.fn(() => 3);
    mockPlayer.countMaxOpponentVP = jest.fn(() => 3);

    const priority = firstGame.gainPriority(mockState, mockPlayer);

    expect(priority).toEqual(expect.arrayContaining([cards.Market]));
  });

  test('gainPriority doesn\'t want a market after the first', () => {
    mockState.phase = PHASE_ACTION;
    mockPlayer.countInDeck.mockImplementation(card => card === cards.Market ? 1 : 0);
    mockPlayer.countVP = jest.fn(() => 3);
    mockPlayer.countMaxOpponentVP = jest.fn(() => 3);

    const priority = firstGame.gainPriority(mockState, mockPlayer);

    expect(priority).not.toEqual(expect.arrayContaining([cards.Market]));
  })

  test('gainPriority wants a first Gold if there is none in the deck', () => {
    mockState.phase = PHASE_BUY;
    mockPlayer.countInDeck.mockReturnValue(0);
    mockPlayer.countVP = jest.fn(() => 3);
    mockPlayer.countMaxOpponentVP = jest.fn(() => 3);

    const priority = firstGame.gainPriority(mockState, mockPlayer);

    expect(priority).toEqual(expect.arrayContaining([cards.Gold]));
  });

  test('gainPriority doesn\'t want a Gold after the first', () => {
    mockState.phase = PHASE_BUY;
    mockPlayer.countInDeck.mockImplementation(card => card === cards.Gold ? 1 : 0);
    mockPlayer.countVP = jest.fn(() => 3);
    mockPlayer.countMaxOpponentVP = jest.fn(() => 3);

    const priority = firstGame.gainPriority(mockState, mockPlayer);

    expect(priority).not.toEqual(expect.arrayContaining([cards.Gold]));
  })

  test('getMoneyInHand calculates coins correctly', () => {
    mockPlayer.countInHand.mockImplementation(card => {
      if (card === 'Copper') return 3;
      if (card === cards.Silver) return 2;
      if (card === cards.Gold) return 1;
      return 0;
    });
    mockPlayer.coins = 1;

    const coins = firstGame.getMoneyInHand(mockPlayer);
    expect(coins).toBe(11);
  });

});