
import Witch from '../witch';
import { DomPlayer } from '../domPlayer';
import cards from '../../../game/cards';

describe('Witch Strategy', () => {
  let witch;
  let mockState;
  let mockPlayer;

  beforeEach(() => {
    witch = new Witch();
    mockState = {
      countInSupply: jest.fn()
    };
    mockPlayer = {
      countInDeck: jest.fn()
    };
  });

  it('should extend DomPlayer', () => {
    expect(witch).toBeInstanceOf(DomPlayer);
  });

  it('should require Witch card in constructor', () => {
    expect(witch.requires).toContain(cards.Witch);
  });

  describe('gainPriority', () => {
    it('should prioritize Province when having Gold', () => {
      mockPlayer.countInDeck.mockImplementation(card => 
        card === cards.Gold ? 1 : 0
      );
      
      const priority = witch.gainPriority(mockState, mockPlayer);
      
      expect(priority[0]).toBe(cards.Province);
    });

    it('should include Duchy when Province pile is low', () => {
      mockState.countInSupply.mockImplementation(card => 
        card === cards.Province ? 5 : 8
      );
      
      const priority = witch.gainPriority(mockState, mockPlayer);
      
      expect(priority).toContain(cards.Duchy);
    });

    it('should include Estate when Province pile is very low', () => {
      mockState.countInSupply.mockImplementation(card => 
        card === cards.Province ? 2 : 8
      );
      
      const priority = witch.gainPriority(mockState, mockPlayer);
      
      expect(priority).toContain(cards.Estate);
    });

    it('should prioritize first Witch card when none in deck', () => {
      mockPlayer.countInDeck.mockImplementation(card => 
        card === cards.Witch ? 0 : 0
      );
      
      const priority = witch.gainPriority(mockState, mockPlayer);
      
      expect(priority.indexOf(cards.Witch)).toBeLessThan(priority.indexOf(cards.Gold));
    });

    it('should include second Witch after Gold if only one in deck', () => {
      mockPlayer.countInDeck.mockImplementation(card => 
        card === cards.Witch ? 1 : 0
      );
      
      const priority = witch.gainPriority(mockState, mockPlayer);
      const goldIndex = priority.indexOf(cards.Gold);
      const witchIndex = priority.indexOf(cards.Witch);
      
      expect(goldIndex).toBeLessThan(witchIndex);
      expect(witchIndex).toBeLessThan(priority.indexOf(cards.Silver));
    });

    it('should not include additional Witch if already has two', () => {
      mockPlayer.countInDeck.mockImplementation(card => 
        card === cards.Witch ? 2 : 0
      );
      
      const priority = witch.gainPriority(mockState, mockPlayer);
      const witchOccurrences = priority.filter(card => card === cards.Witch).length;
      
      expect(witchOccurrences).toBe(0);
    });

    it('should always include basic treasure cards in correct order', () => {
      const priority = witch.gainPriority(mockState, mockPlayer);
      const goldIndex = priority.indexOf(cards.Gold);
      const silverIndex = priority.indexOf(cards.Silver);
      
      expect(goldIndex).toBeLessThan(silverIndex);
    });
  });
});