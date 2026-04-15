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

  describe('Duchy Dancing', () => {
    test('wants to buy duchy when extremely behind in points', () => {
      mockState.countInSupply.mockReturnValue(6);
      mockState.phase = PHASE_BUY;
      mockPlayer.countVP = jest.fn(() => 6);
      mockPlayer.countMaxOpponentVP = jest.fn(() => 26);
      mockPlayer.countInDeck.mockReturnValue(1);

      const priority = firstGame.gainPriority(mockState, mockPlayer);
      expect(priority).toEqual(expect.arrayContaining([cards.Duchy, null]));
      expect(priority.filter(card => card === cards.Duchy).length).toBe(1);
    });

    test('wants to buy extend the game when behind in points', () => {
      mockState.countInSupply.mockReturnValue(2);
      mockState.phase = PHASE_BUY;
      mockPlayer.countVP = jest.fn(() => 6);
      mockPlayer.countMaxOpponentVP = jest.fn(() => 6);

      const priority = firstGame.gainPriority(mockState, mockPlayer);
      expect(priority).toEqual(expect.arrayContaining([cards.Duchy, null]));
      expect(priority.filter(card => card === cards.Duchy).length).toBe(1);
    });

    test('doesn\'t duchy-dance any more on last province', () => {
      mockState.countInSupply.mockReturnValue(1);
      mockState.phase = PHASE_BUY;
      mockPlayer.countVP = jest.fn(() => 6);
      mockPlayer.countMaxOpponentVP = jest.fn(() => 26);
      mockPlayer.countInDeck.mockReturnValue(1);

      const priority = firstGame.gainPriority(mockState, mockPlayer);
      // Only one instance of Duchy should be in the priority list (base greening)
      expect(priority).toEqual(expect.arrayContaining([cards.Duchy, null]));
      expect(priority.filter(card => card === cards.Duchy).length).toBe(1);
    });

    test('doesn\'t want panic Duchy before first Province', () => {
      mockState.countInSupply.mockReturnValue(6);
      mockState.phase = PHASE_BUY;
      mockPlayer.countVP = jest.fn(() => 6);
      mockPlayer.countMaxOpponentVP = jest.fn(() => 26);
      mockPlayer.countInDeck.mockReturnValue(0);

      const priority = firstGame.gainPriority(mockState, mockPlayer);
      expect(priority).not.toContain(cards.Duchy);
    });

    test('no Duchy dancing when winning', () => {
      mockState.countInSupply.mockReturnValue(6);
      mockState.phase = PHASE_BUY;
      mockPlayer.countVP = jest.fn(() => 6);
      mockPlayer.countMaxOpponentVP = jest.fn(() => 0);
      mockPlayer.countInDeck.mockReturnValue(1);

      const priority = firstGame.gainPriority(mockState, mockPlayer);
      expect(priority).not.toContain(cards.Duchy);
    });

    test('no Duchy dancing when winning 2', () => {
      mockState.countInSupply.mockReturnValue(2);
      mockState.phase = PHASE_BUY;
      mockPlayer.countVP = jest.fn(() => 6);
      mockPlayer.countMaxOpponentVP = jest.fn(() => 0);

      const priority = firstGame.gainPriority(mockState, mockPlayer);
      expect(priority).not.toContain(cards.Duchy);
    });

    test('no duchy dancing mid-turn', () => {
      mockState.countInSupply.mockReturnValue(6);
      mockState.phase = PHASE_ACTION;
      mockPlayer.countVP = jest.fn(() => 6);
      mockPlayer.countMaxOpponentVP = jest.fn(() => 26);
      mockPlayer.countInDeck.mockReturnValue(1);

      const priority = firstGame.gainPriority(mockState, mockPlayer);
      expect(priority).not.toContain(cards.Duchy);
    });

    test('no duchy dancing mid-turn 2', () => {
      mockState.countInSupply.mockReturnValue(2);
      mockState.phase = PHASE_ACTION;
      mockPlayer.countVP = jest.fn(() => 6);
      mockPlayer.countMaxOpponentVP = jest.fn(() => 26);

      const priority = firstGame.gainPriority(mockState, mockPlayer);
      expect(priority).not.toContain(cards.Duchy);
    });

    test('Not desperate for Duchies if already buying provinces', () => {
      mockState.countInSupply.mockReturnValue(2);
      mockState.phase = PHASE_BUY;
      mockPlayer.countVP = jest.fn(() => 6);
      mockPlayer.countMaxOpponentVP = jest.fn(() => 26);
      mockPlayer.countInDeck.mockReturnValue(1);

      const priority = firstGame.gainPriority(mockState, mockPlayer);
      expect(priority).toEqual(expect.arrayContaining([cards.Duchy, null]));
      // One Duchy from base greening, one from duchy-dancing behind on points
      expect(priority.filter(card => card === cards.Duchy).length).toBe(2);
    });
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
    mockState.countInSupply.mockImplementation(card => (card === cards.Province ? 2 : 10));
    mockPlayer.countInDeck.mockReturnValueOnce(1); // Province count
    mockPlayer.countVP = jest.fn(() => 30);
    mockPlayer.countMaxOpponentVP = jest.fn(() => 40);

    const priority = firstGame.gainPriority(mockState, mockPlayer);

    expect(priority).toEqual(expect.arrayContaining([cards.Duchy, null]));
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