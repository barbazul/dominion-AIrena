import WorkshopGardens from '../workshopGardens';
import cards from '../../../game/cards';

describe('WorkshopGardens', () => {
  let workshopGardens;
  let state;
  let my;

  beforeEach(() => {
    workshopGardens = new WorkshopGardens();
    state = {}; // Mocking state object
    my = {
      countInDeck: jest.fn(card => workshopGardens.countInDeck(card))
    };
  });

  test('should initialize requirements correctly', () => {
    expect(workshopGardens.requires).toEqual([cards.Gardens, cards.Workshop]);
  });

  test('should return correct gainPriority without Gardens priority condition', () => {
    my.countInDeck.mockReturnValue(0); // Without > 8 Workshops
    const priority = workshopGardens.gainPriority(state, my);
    expect(priority).toEqual([cards.Workshop, cards.Estate, cards.Silver, cards.Copper]);
  });

  test('should return correct gainPriority with Gardens priority condition', () => {
    my.countInDeck.mockImplementation(card => (card === cards.Workshop ? 9 : 0)); // > 8 Workshops
    const priority = workshopGardens.gainPriority(state, my);
    expect(priority).toEqual([cards.Gardens, cards.Workshop, cards.Estate, cards.Silver, cards.Copper]);
  });
});
