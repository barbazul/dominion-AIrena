import BigMoneyUltimate from '../bigMoneyUltimate.js';
import cards from '../../../game/cards.js';
import { DomPlayer } from '../domPlayer.js';

describe('BigMoneyUltimate', () => {
  let player;
  let gameState;

  beforeEach(() => {
    player = new BigMoneyUltimate();
    gameState = {
      countInSupply: jest.fn()
    };
  });

  describe('constructor', () => {
    it('should extend DomPlayer', () => {
      expect(player).toBeInstanceOf(DomPlayer);
    });

    it('should set the correct name', () => {
      expect(player.name).toBe('Big Money Ultimate');
    });
  });

  describe('gainPriority', () => {
    let playerState;

    beforeEach(() => {
      playerState = {};
      // Mock getTotalMoney method
      player.getTotalMoney = jest.fn();
    });

    it('should prioritize Province when total money is over 18', () => {
      player.getTotalMoney.mockReturnValue(19);
      gameState.countInSupply.mockReturnValue(8); // Plenty of Provinces

      const priority = player.gainPriority(gameState, playerState);
      
      expect(priority).toContain(cards.Province);
      expect(priority.indexOf(cards.Province)).toBeLessThan(priority.indexOf(cards.Gold));
    });

    it('should include Duchy in priorities when Provinces <= 4', () => {
      player.getTotalMoney.mockReturnValue(15);
      gameState.countInSupply.mockReturnValue(4); // Low on Provinces

      const priority = player.gainPriority(gameState, playerState);
      
      expect(priority).toContain(cards.Duchy);
      expect(priority.indexOf(cards.Duchy)).toBeLessThan(priority.indexOf(cards.Silver));
    });

    it('should include Estate in priorities when Provinces <= 2', () => {
      player.getTotalMoney.mockReturnValue(15);
      gameState.countInSupply.mockReturnValue(2); // Very low on Provinces

      const priority = player.gainPriority(gameState, playerState);
      
      expect(priority).toContain(cards.Estate);
      expect(priority.indexOf(cards.Estate)).toBeLessThan(priority.indexOf(cards.Silver));
    });

    it('should always include basic treasure cards in correct order', () => {
      player.getTotalMoney.mockReturnValue(15);
      gameState.countInSupply.mockReturnValue(8);

      const priority = player.gainPriority(gameState, playerState);
      
      expect(priority).toContain(cards.Gold);
      expect(priority).toContain(cards.Silver);
      expect(priority.indexOf(cards.Gold)).toBeLessThan(priority.indexOf(cards.Silver));
    });

    it('should include Duchy later in priorities when Provinces <= 6', () => {
      player.getTotalMoney.mockReturnValue(15);
      gameState.countInSupply.mockReturnValue(6);

      const priority = player.gainPriority(gameState, playerState);
      
      expect(priority).toContain(cards.Duchy);
      expect(priority.indexOf(cards.Duchy)).toBeGreaterThan(priority.indexOf(cards.Gold));
      expect(priority.indexOf(cards.Duchy)).toBeLessThan(priority.indexOf(cards.Silver));
    });
  });
});