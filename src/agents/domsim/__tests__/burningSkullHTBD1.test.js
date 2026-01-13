import BurningSkullHTBD1 from '../burningSkullHTBD1.js';
import cards from '../../../game/cards.js';

describe('BurningSkullHTBD1', () => {
  let mockState, mockMy, instance;

  beforeEach(() => {
    mockState = {
      countInSupply: jest.fn()
    };
    mockMy = {
      countInDeck: jest.fn(),
      log: jest.fn()
    };
    instance = new BurningSkullHTBD1();

    // Mock helper methods
    instance.getTotalMoney = jest.fn();
    instance.countCardTypeInDeck = jest.fn();
  });

  test('should prioritize Province when Laboratory exists in deck', () => {
    mockMy.countInDeck.mockReturnValue(1); // Laboratory count
    const result = instance.gainPriority(mockState, mockMy);
    expect(result).toContain(cards.Province);
    expect(mockMy.log).toHaveBeenCalledWith('I have 1 Labs -> I want Province');
  });

  test('should prioritize Duchy when Provinces in supply are 4 or less', () => {
    mockState.countInSupply.mockReturnValue(4); // Provinces in Supply
    const result = instance.gainPriority(mockState, mockMy);
    expect(result).toContain(cards.Duchy);
    expect(mockMy.log).toHaveBeenCalledWith('There are 4 Provs left -> I want Duchy');
  });

  test('should prioritize Estate when Provinces in supply are 2 or less', () => {
    mockState.countInSupply.mockReturnValue(2); // Provinces in Supply
    const result = instance.gainPriority(mockState, mockMy);
    expect(result).toContain(cards.Estate);
    expect(mockMy.log).toHaveBeenCalledWith('There are 2 Provs left -> I want Estate');
  });

  test('should prioritize Sentry when less than 4 exist in deck', () => {
    mockMy.countInDeck.mockImplementation((card) => {
      switch (card) {
        case cards.Sentry: return 2;
        default: return 0;
      }
    });

    const result = instance.gainPriority(mockState, mockMy);
    expect(result).toContain(cards.Sentry);
    expect(mockMy.log).toHaveBeenCalledWith('I have 2 Sentries -> I want Sentries');
  });

  test('should prioritize Gold when total money is less than 8', () => {
    instance.getTotalMoney.mockReturnValue(7); // Total money
    const result = instance.gainPriority(mockState, mockMy);
    expect(result).toContain(cards.Gold);
    expect(mockMy.log).toHaveBeenCalledWith('I have 7 total moneys -> I want Gold');
  });

  test('should prioritize Vassal when total money is less than 6', () => {
    instance.getTotalMoney.mockReturnValue(5); // Total money
    const result = instance.gainPriority(mockState, mockMy);
    expect(result).toContain(cards.Vassal);
    expect(mockMy.log).toHaveBeenCalledWith('I have 5 total moneys -> I want Vassal');
  });

  test('should prioritize Throne Room when deck conditions are met', () => {
    instance.countCardTypeInDeck.mockReturnValue(5); // Cycler count

    mockMy.countInDeck.mockImplementation((card) => {
      switch (card) {
        case cards.Sentry: return 4;
        default: return 0;
      }
    });

    const result = instance.gainPriority(mockState, mockMy);
    expect(result).toContain(cards['Throne Room']);
    expect(result.filter((card) => card === cards['Throne Room'])).toHaveLength(2);
    expect(mockMy.log).toHaveBeenCalledWith(
        'I have 4 Sentries, 5 cantrips and 0 Throne Rooms -> I want TRs'
    );
  });

  test('should prioritize Militia if none exist in deck', () => {
    mockMy.countInDeck.mockImplementation((card) => {
      switch (card) {
        case cards.Sentry: return 4;
        default: return 0;
      }
    });

    const result = instance.gainPriority(mockState, mockMy);
    expect(result).toContain(cards.Militia);
    expect(mockMy.log).toHaveBeenCalledWith('No Militia -> I want Militia');
  });

  test('should prioritize Vassal if none exist in deck', () => {
    mockMy.countInDeck.mockImplementation((card) => {
      switch (card) {
        case cards.Sentry: return 4;
        case cards.Militia: return 1;
        default: return 0;
      }
    });

    const result = instance.gainPriority(mockState, mockMy);
    expect(result).toContain(cards.Vassal);
    expect(mockMy.log).toHaveBeenCalledWith('No Vassal -> I want Vassal');
  });

  test('should always prioritize Laboratory, Poacher, and Harbinger', () => {
    const result = instance.gainPriority(mockState, mockMy);
    expect(result).toContain(cards.Laboratory);
    expect(result).toContain(cards.Poacher);
    expect(result).toContain(cards.Harbinger);
  });

  test('default priority at game start', () => {
    mockState.countInSupply.mockReturnValue(8);
    mockMy.countInDeck.mockReturnValue(0);
    instance.getTotalMoney.mockReturnValue(0);
    const result = instance.gainPriority(mockState, mockMy);
    expect(result).toStrictEqual([cards.Sentry, cards.Gold, cards.Vassal, cards.Laboratory, cards.Militia, cards.Vassal, cards.Poacher, cards.Harbinger]);
  });

  test('No longer wants Sentries after 4th', () => {
    mockState.countInSupply.mockReturnValue(8);

    mockMy.countInDeck.mockImplementation((card) => {
      switch (card) {
        case cards.Sentry: return 4;
        default: return 0;
      }
    });

    instance.getTotalMoney.mockReturnValue(0);
    const result = instance.gainPriority(mockState, mockMy);
    expect(result).not.toContain(cards.Sentry);
  });

  test('No longer wants Golds after $8', () => {
    mockState.countInSupply.mockReturnValue(8);
    mockMy.countInDeck.mockReturnValue(0);
    instance.getTotalMoney.mockReturnValue(8);
    const result = instance.gainPriority(mockState, mockMy);
    expect(result).not.toContain(cards.Gold);
  });

  test('No longer wants Vassal after first and $8', () => {
    mockState.countInSupply.mockReturnValue(8);
    mockMy.countInDeck.mockReturnValue(1);
    instance.getTotalMoney.mockReturnValue(6);
    const result = instance.gainPriority(mockState, mockMy);
    expect(result).not.toContain(cards.Vassal);
  });

  test('Doesn\' want a Throne Room with only one Sentry', () => {
    mockMy.countInDeck.mockImplementation((card) => {
      switch (card) {
        case cards.Sentry: return 1;
        default: return 0;
      }
    });

    instance.countCardTypeInDeck.mockReturnValue(1);
    const result = instance.gainPriority(mockState, mockMy);
    expect(result).not.toContain(cards['Throne Room']);
  });
});