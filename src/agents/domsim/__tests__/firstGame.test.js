import FirstGame from '../firstGame';

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

  test('gainPriority returns correct priorities when phase is ACTION', () => {
    mockState.phase = 'PHASE_ACTION';
    mockPlayer.countInDeck.mockReturnValue(0);
    mockPlayer.countCardTypeInDeck.mockReturnValue(0);

    const priority = firstGame.gainPriority(mockState, mockPlayer);

    expect(priority).toEqual(expect.arrayContaining(['Gold', 'Silver', null]));
  });

  test('gainPriority returns priority including Cellar under specific conditions', () => {
    mockState.phase = 'PHASE_ACTION';
    mockPlayer.countInDeck.mockImplementation(card => (card === 'Cellar' ? 0 : 2));
    mockPlayer.countCardTypeInDeck.mockReturnValue(4);

    const priority = firstGame.gainPriority(mockState, mockPlayer);

    expect(priority).toEqual(expect.arrayContaining(['Cellar', null]));
  });

  test('gainPriority adds Village and Mine on first turns', () => {
    mockPlayer.turnsTaken = 1;
    mockPlayer.countInDeck.mockImplementation(card => (card === 'Market' ? 1 : 0));

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

  test('getMoneyInHand calculates coins correctly', () => {
    mockPlayer.countInHand.mockImplementation(card => {
      if (card === 'Copper') return 3;
      if (card === 'Silver') return 2;
      if (card === 'Gold') return 1;
      return 0;
    });
    mockPlayer.coins = 1;

    const coins = firstGame.getMoneyInHand(mockPlayer);
    expect(coins).toBe(11);
  });

});