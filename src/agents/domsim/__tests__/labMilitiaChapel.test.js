import LabMilitiaChapel from '../labMilitiaChapel.js';
import cards from '../../../game/cards.js';

describe('LabMilitiaChapel', () => {
  let player, state;

  beforeEach(() => {
    player = {
      getAvailableMoney: jest.fn(),
      countInDeck: jest.fn()
    };
    state = {
      countInSupply: jest.fn()
    };
  });

  test('should initialize with the correct properties', () => {
    const bot = new LabMilitiaChapel();
    expect(bot.name).toBe('Lab/Militia/Chapel');
    expect(bot.requires).toEqual(['Festival', 'Market', 'Laboratory', 'Militia', 'Chapel']);
    expect(bot.playStrategies[cards.Chapel]).toBeDefined();
  });

  test('should include Province in priority if available money is 13 or more', () => {
    const bot = new LabMilitiaChapel();
    player.getAvailableMoney.mockReturnValue(13);
    const priority = bot.gainPriority(state, player);
    expect(priority).toContain(cards.Province);
  });

  test('should include Province in priority if already owned', () => {
    const bot = new LabMilitiaChapel();
    player.countInDeck.mockImplementation((card) =>
      card === cards.Province ? 1 : 0
    );
    const priority = bot.gainPriority(state, player);
    expect(priority).toContain(cards.Province);
  });

  test('should include Duchy if there are 3 or fewer Provinces in the supply', () => {
    const bot = new LabMilitiaChapel();
    state.countInSupply.mockImplementation((card) =>
      card === cards.Province ? 3 : 10
    );
    const priority = bot.gainPriority(state, player);
    expect(priority).toContain(cards.Duchy);
  });

  test('should include Estate if there are 2 or fewer Provinces in the supply', () => {
    const bot = new LabMilitiaChapel();
    state.countInSupply.mockImplementation((card) =>
      card === cards.Province ? 2 : 10
    );
    const priority = bot.gainPriority(state, player);
    expect(priority).toContain(cards.Estate);
  });

  test('should include Gold if no Gold cards are in the deck', () => {
    const bot = new LabMilitiaChapel();
    player.countInDeck.mockImplementation((card) =>
      card === cards.Gold ? 0 : 1
    );
    const priority = bot.gainPriority(state, player);
    expect(priority).toContain(cards.Gold);
  });

  test('should include Festival if no Festival cards are in the deck', () => {
    const bot = new LabMilitiaChapel();
    player.countInDeck.mockImplementation((card) =>
      card === cards.Festival ? 0 : 1
    );
    const priority = bot.gainPriority(state, player);
    expect(priority).toContain(cards.Festival);
  });

  test('should include Market if more than 2 Laboratory cards are in the deck', () => {
    const bot = new LabMilitiaChapel();
    player.countInDeck.mockImplementation((card) =>
      card === cards.Laboratory ? 3 : 0
    );
    const priority = bot.gainPriority(state, player);
    expect(priority).toContain(cards.Market);
  });

  test('should include Laboratory as part of the default priority', () => {
    const bot = new LabMilitiaChapel();
    const priority = bot.gainPriority(state, player);
    expect(priority).toContain(cards.Laboratory);
  });

  test('should include Militia if no Militia cards are in the deck', () => {
    const bot = new LabMilitiaChapel();
    player.countInDeck.mockImplementation((card) =>
      card === cards.Militia ? 0 : 1
    );
    const priority = bot.gainPriority(state, player);
    expect(priority).toContain(cards.Militia);
  });

  test('should include Chapel if no Chapel cards are in the deck', () => {
    const bot = new LabMilitiaChapel();
    player.countInDeck.mockImplementation((card) =>
      card === cards.Chapel ? 0 : 1
    );
    const priority = bot.gainPriority(state, player);
    expect(priority).toContain(cards.Chapel);
  });

  test('should include Silver as part of the default priority', () => {
    const bot = new LabMilitiaChapel();
    const priority = bot.gainPriority(state, player);
    expect(priority).toContain(cards.Silver);
  });
});
