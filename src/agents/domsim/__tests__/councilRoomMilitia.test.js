import CouncilRoomMilitia from '../councilRoomMilitia.js';
import cards from "../../../game/cards.js";

describe('CouncilRoomMilitia', () => {
  let stateMock, playerMock, councilRoomMilitia;

  beforeEach(() => {
    stateMock = {
      countInSupply: jest.fn(),
    };

    playerMock = {
      getAvailableMoney: jest.fn(),
      countInDeck: jest.fn(),
    };

    councilRoomMilitia = new CouncilRoomMilitia();
  });

  test('priority at game start', () => {
    stateMock.countInSupply.mockReturnValue(8);
    playerMock.getAvailableMoney.mockReturnValue(7);
    playerMock.countInDeck.mockReturnValue(0);
    councilRoomMilitia.getTotalMoney = jest.fn().mockReturnValue(7);
    const result = councilRoomMilitia.gainPriority(stateMock, playerMock);
    expect(result).toEqual([cards['Council Room'], cards.Militia, cards.Village]);
  });

  test('should prioritize "Province" if player has 13 or more money available', () => {
    playerMock.getAvailableMoney.mockReturnValue(13);
    const result = councilRoomMilitia.gainPriority(stateMock, playerMock);
    expect(result).toContain(cards.Province);
  });

  test('should prioritize "Province" if player already has at least one in their deck', () => {
    playerMock.countInDeck.mockImplementation((card) => (card === cards.Province ? 1 : 0));
    const result = councilRoomMilitia.gainPriority(stateMock, playerMock);
    expect(result).toContain(cards.Province);
  });

  test('should prioritize "Duchy" if 4 or fewer Provinces are left in the supply', () => {
    stateMock.countInSupply.mockImplementation((card) => (card === cards.Province ? 4 : 0));
    const result = councilRoomMilitia.gainPriority(stateMock, playerMock);
    expect(result).toContain(cards.Duchy);
  });

  test('should prioritize "Estate" if 2 or fewer Provinces are left in the supply', () => {
    stateMock.countInSupply.mockImplementation((card) => (card === cards.Province ? 2 : 0));
    const result = councilRoomMilitia.gainPriority(stateMock, playerMock);
    expect(result).toContain(cards.Estate);
  });

  test('should prioritize "Gold" if player has fewer Golds than Council Rooms minus one and total money is below 16', () => {
    playerMock.countInDeck.mockImplementation((card) => {
      if (card === cards.Gold) return 1;
      if (card === cards['Council Room']) return 3;
      return 0;
    });
    councilRoomMilitia.getTotalMoney = jest.fn().mockReturnValue(15);

    const result = councilRoomMilitia.gainPriority(stateMock, playerMock);
    expect(result).toContain(cards.Gold);
  });

  test('should prioritize "Council Room" if player has none in their deck', () => {
    playerMock.countInDeck.mockImplementation((card) => (card === cards['Council Room'] ? 0 : 0));
    const result = councilRoomMilitia.gainPriority(stateMock, playerMock);
    expect(result).toContain(cards['Council Room']);
  });

  test('should prioritize "Council Room" if player has fewer Council Rooms than Villages minus one', () => {
    playerMock.countInDeck.mockImplementation((card) => {
      if (card === cards['Council Room']) return 1;
      if (card === cards.Village) return 3;
      return 0;
    });

    const result = councilRoomMilitia.gainPriority(stateMock, playerMock);
    expect(result).toContain(cards['Council Room']);
  });

  test('should prioritize "Militia" if player has none in their deck', () => {
    playerMock.countInDeck.mockImplementation((card) => (card === cards.Militia ? 0 : 0));
    const result = councilRoomMilitia.gainPriority(stateMock, playerMock);
    expect(result).toContain(cards.Militia);
  });

  test('should always include "Village" in the priority list', () => {
    const result = councilRoomMilitia.gainPriority(stateMock, playerMock);
    expect(result).toContain(cards.Village);
  });
});