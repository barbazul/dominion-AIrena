import BasicAction from '../../cards/basicAction';
import cards from '../../game/cards';
import BasicAI from '../basicAI';
import Card from '../../cards/card';
import Player from '../../game/player';
import State from '../../game/state';

test('toString returns agent name', () => {
  const ai = new BasicAI();

  expect(ai.toString()).toBe('BasicAI');
  ai.name = 'Carlos';
  expect(ai.toString()).toBe('Carlos');
});

test('myPlayer throws error when agent is not playing', () => {
  const ai1 = new BasicAI();
  const ai2 = new BasicAI();
  const ai3 = new BasicAI();
  const state = new State();

  state.setUp([ai1, ai2]);
  expect(() => {
    ai3.myPlayer(state);
  }).toThrow();
});

test('myPlayer returns the correct player', () => {
  const ai1 = new BasicAI();
  const ai2 = new BasicAI();
  const state = new State();

  state.setUp([ai1, ai2]);
  expect(ai1.myPlayer(state).agent).toBe(ai1);
  expect(ai1.myPlayer(state).agent).not.toBe(ai2);
  expect(ai2.myPlayer(state).agent).toBe(ai2);
  expect(ai2.myPlayer(state).agent).not.toBe(ai1);
});

test('Choose null when there are no choices', () => {
  const ai1 = new BasicAI();
  const ai2 = new BasicAI();
  const state = new State();

  state.setUp([ ai1, ai2 ]);
  expect(ai1.choose(BasicAI.CHOICE_DISCARD, state, [])).toBeNull();
});

test('Choose only choice', () => {
  const ai1 = new BasicAI();
  const ai2 = new BasicAI();
  const state = new State();
  const card1 = new Card();

  state.setUp([ ai1, ai2 ]);
  ai1.fakeValue = () => -Infinity;
  expect(ai1.choose('fake', state, [card1])).toBe(card1);
});

test('Default discardPriority', () => {
  const ai = new BasicAI();
  const state = new State();
  const player = new Player(ai, () => {});
  const priority = ai.discardPriority(state, player);

  expect(priority.length).toBeGreaterThan(0);

  priority.forEach(choice => {
    expect(choice).toEqual(expect.any(String));
  });
});

test('Missing priority function returns null', () => {
  const ai = new BasicAI();

  expect(ai.getPriorityFunction('fake')).toBeNull();
});

test('Get existing priority function', () => {
  const ai = new BasicAI();

  expect(ai.getPriorityFunction('discard')).toEqual(expect.any(Function));
});

test('Priority list is considered when possible', () => {
  const ai1 = new BasicAI();
  const ai2 = new BasicAI();
  const state = new State();
  const card1 = new Card();
  const card2 = new Card();

  state.setUp([ ai1, ai2 ]);
  ai1.discardPriority = () => [ 'Skip this', 'Choose this', 'Ignore this' ];
  card1.name = 'Ignore this';
  card2.name = 'Choose this';
  expect(ai1.choose('discard', state, [ card1, card2 ])).toEqual(card2);
});

test('Return null when its legal and preferable', () => {
  const ai1 = new BasicAI();
  const ai2 = new BasicAI();
  const state = new State();

  state.setUp([ ai1, ai2 ]);
  ai1.discardPriority = () => [ 'Skip this', null, 'Ignore this' ];
  expect(ai1.choose('discard', state, [ 'Ignore this', null ])).toBeNull();
});

test('Choice value of null is 0', () => {
  const ai1 = new BasicAI();
  const ai2 = new BasicAI();
  const state = new State();

  state.setUp([ ai1, ai2 ]);
  const choiceValue = ai1.getChoiceValue('discard', state, null, ai1.myPlayer(state));
  expect(choiceValue).toBe(0);
});

test('Choice value is -1000 if ai does not know how to make the decision', () => {
  const ai1 = new BasicAI();
  const ai2 = new BasicAI();
  const state = new State();

  state.setUp([ ai1, ai2 ], { warn: () => {} });
  const choiceValue = ai1.getChoiceValue('fakeType', state, 'fakeChoice', ai1.myPlayer(state));
  expect(choiceValue).toBe(-1000);
});

test('Missing value function returns null', () => {
  const ai = new BasicAI();

  expect(ai.getValueFunction('fake')).toBeNull();
});

test('Fallback discard value is negative card cost', () => {
  const ai1 = new BasicAI();
  const ai2 = new BasicAI();
  const state = new State();
  const card = new Card();
  let player;

  state.setUp([ ai1, ai2 ]);
  player = ai1.myPlayer(state);
  // Setting actions to 0 to validate the action case
  player.actions = 0;
  card.isAction = () => false;
  card.cost = 5;
  expect(ai1.discardValue(state, card, player)).toBeLessThan(0);
});

test('Action discard value is greater when no actions left', () => {
  const ai1 = new BasicAI();
  const ai2 = new BasicAI();
  const state = new State();
  const card = new Card();
  /** @var {Player} player */
  let player;

  state.setUp([ ai1, ai2 ]);
  player = ai1.myPlayer(state);
  player.actions = 0;
  card.isAction = () => true;
  card.cost = 5;
  expect(ai1.discardValue(state, card, player)).toBeGreaterThanOrEqual(0);
});

test('Get existing value function', () => {
  const ai = new BasicAI();

  expect(ai.getValueFunction('discard')).toEqual(expect.any(Function));
});

test('Get choice value from specific function', () => {
  const ai1 = new BasicAI();
  const ai2 = new BasicAI();
  const state = new State();
  /** @var {Player} player */
  let player;

  state.setUp([ ai1, ai2 ]);
  player = ai1.myPlayer(state);
  ai1.fakeValue = () => 123456;
  expect(ai1.getChoiceValue('fake', state, new Card(), player)).toBe(123456);
});

test('Specific function cant assign value to choice', () => {
  const ai1 = new BasicAI();
  const ai2 = new BasicAI();
  const state = new State();
  const warnFunction = jest.fn(() => {});
  const card = new Card();
  /** @var {Player} player */
  let player;

  state.setUp([ ai1, ai2 ], { warn: warnFunction });
  player = ai1.myPlayer(state);
  ai1.fakeValue = () => null;
  ai1.name = 'AIName';
  card.name = 'Fake Card';
  expect(ai1.getChoiceValue('fake', state, card, player)).toBe(-1000);
  expect(warnFunction).toHaveBeenCalledWith("AIName doesn't know how to make a fake decision for Fake Card");
});

test('Make choice based on value function when priority list fails', () => {
  const ai1 = new BasicAI();
  const ai2 = new BasicAI();
  const state = new State();
  const valueFunction = jest.fn(() => 1000);
  const card = new Card();

  state.setUp([ ai1, ai2 ]);
  card.name = 'Fake Card';
  ai1.fakeValue = valueFunction;
  ai1.fakePriority = () => [ 'Other Card', 'Better Card' ];
  ai1.choose('fake', state, [card, card]);
  expect(valueFunction).toHaveBeenCalled();
});

test('Make choice based on value function when priority list is missing', () => {
  const ai1 = new BasicAI();
  const ai2 = new BasicAI();
  const state = new State();
  const valueFunction = jest.fn(() => 1000);
  const card = new Card();

  state.setUp([ ai1, ai2 ]);
  card.name = 'Fake Card';
  ai1.fakeValue = valueFunction;
  ai1.choose('fake', state, [card, card]);
  expect(valueFunction).toHaveBeenCalled();
});

test('Choice by value returns the best choice', () => {
  const ai1 = new BasicAI();
  const ai2 = new BasicAI();
  const state = new State();
  const valueFunction = (state, choice) => {
    if (choice.name === 'Best Choice') {
      return 100;
    }

    return 0;
  };
  const card1 = new Card();
  const card2 = new Card();

  state.setUp([ ai1, ai2 ]);
  card1.name = 'Worst Choice';
  card2.name = 'Best Choice';
  ai1.fakeValue = valueFunction;
  ai1.fakePriority = () => [];

  expect(ai1.choose('fake', state, [card1, card2])).toBe(card2);
});

test('Throw an error when AI cant make a choice', () => {
  const ai1 = new BasicAI();
  const ai2 = new BasicAI();
  const state = new State();
  const card1 = new Card();
  const card2 = new Card();

  state.setUp([ ai1, ai2 ]);
  ai1.fakeValue = () => -Infinity;

  expect(() => {
    ai1.choose('fake', state, [card1, card2]);
  }).toThrow('BasicAI somehow failed to make a choice');
});

test('Default gainPriority', () => {
  const ai1 = new BasicAI();
  const ai2 = new BasicAI();
  const state = new State();

  state.setUp([ai1, ai2]);
  state.current.countInDeck = jest.fn(() => 1);
  state.countInSupply = jest.fn(() => 8);
  state.gainsToEndGame = jest.fn(() => 8);

  expect(state.current.agent.gainPriority(state, state.current)).toEqual(
    [
      'Colony',
      'Platinum',
      'Gold',
      'Silver'
    ]
  );
});

test('Skip colony without Platinum', () => {
  const ai1 = new BasicAI();
  const ai2 = new BasicAI();
  const state = new State();

  state.setUp([ai1, ai2]);
  state.current.countInDeck = jest.fn(() => 0);
  state.countInSupply = jest.fn(() => 8);
  state.gainsToEndGame = jest.fn(() => 8);

  expect(state.current.agent.gainPriority(state, state.current)).not.toContain('Colony');
});

test('Prefer Province with less than 7 colonies', () => {
  const ai1 = new BasicAI();
  const ai2 = new BasicAI();
  const state = new State();

  state.setUp([ai1, ai2]);
  state.current.countInDeck = jest.fn(() => 0);
  state.countInSupply = jest.fn(() => 6);
  state.gainsToEndGame = jest.fn(() => 8);

  expect(state.current.agent.gainPriority(state, state.current)).toContain('Province');
});

test('Prefer Duchy with less than 6 gains to end game', () => {
  const ai1 = new BasicAI();
  const ai2 = new BasicAI();
  const state = new State();

  state.setUp([ai1, ai2]);
  state.current.countInDeck = jest.fn(() => 0);
  state.countInSupply = jest.fn(() => 6);
  state.gainsToEndGame = jest.fn(() => 5);

  expect(state.current.agent.gainPriority(state, state.current)).toContain('Duchy');
});

test('Prefer Estate with less than 3 gains to end game', () => {
  const ai1 = new BasicAI();
  const ai2 = new BasicAI();
  const state = new State();

  state.setUp([ai1, ai2]);
  state.current.countInDeck = jest.fn(() => 0);
  state.countInSupply = jest.fn(() => 6);
  state.gainsToEndGame = jest.fn(() => 2);

  expect(state.current.agent.gainPriority(state, state.current)).toContain('Estate');
});

test('Prefer Copper with less than 4 gains to end game', () => {
  const ai1 = new BasicAI();
  const ai2 = new BasicAI();
  const state = new State();

  state.setUp([ai1, ai2]);
  state.current.countInDeck = jest.fn(() => 0);
  state.countInSupply = jest.fn(() => 6);
  state.gainsToEndGame = jest.fn(() => 3);

  expect(state.current.agent.gainPriority(state, state.current)).toContain('Copper');
});

test('Fallback gainValue is negative.', () => {
  const ai = new BasicAI();
  const state = new State();
  const player = new Player(ai, () => {});
  const card = new Card();

  card.cost = 3;

  expect(ai.gainValue(state, card, player)).toBeLessThan(0);
});

test('Fallback gainValue prefers treasures and actions', () => {
  const ai = new BasicAI();
  const state = new State();
  const player = new Player(ai, () => {});
  const card1 = new Card();
  const card2 = new Card();
  const card3 = new Card();
  const card4 = new Card();
  let card1Value, card2Value, card3Value, card4Value;

  card1.cost = 3;
  card2.cost = 3;
  card2.isTreasure = () => true;
  card3.cost = 3;
  card3.isAction = () => true;
  card4.cost = 3;
  card4.isTreasure = () => true;
  card4.isAction = () => true;

  card1Value = ai.gainValue(state, card1, player);
  card2Value = ai.gainValue(state, card2, player);
  card3Value = ai.gainValue(state, card3, player);
  card4Value = ai.gainValue(state, card4, player);

  expect(card2Value).toBeGreaterThan(card1Value);
  expect(card3Value).toBeGreaterThan(card1Value);
  expect(card4Value).toBeGreaterThan(card2Value);
  expect(card4Value).toBeGreaterThan(card3Value);
});

test('Fallback playValue function -> Basic treasures', () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai]);

  // Base treasures
  expect(ai.playValue(state, cards.Copper, state.current)).toBe(100);
  expect(ai.playValue(state, cards.Silver, state.current)).toBe(100);
  expect(ai.playValue(state, cards.Gold, state.current)).toBe(100);
});

test('Fallback playValue function -> Menagerie', () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai]);

  // No duplicates in hand
  state.current.hand = [cards.Copper, cards.Estate];
  expect(ai.playValue(state, cards.Menagerie, state.current)).toBe(980);

  // Duplicates in hand
  state.current.hand = [cards.Copper, cards.Estate, cards.Estate];
  expect(ai.playValue(state, cards.Menagerie, state.current)).toBe(340);

  // 2 Menageries still trigger as one will leave hand
  state.current.hand = [cards.Menagerie, cards.Menagerie];
  expect(ai.playValue(state, cards.Menagerie, state.current)).toBe(980);
});

test('Fallback playValue function -> Shanty Town', () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai]);

  // No actions in hand
  state.current.hand = [cards.Copper, cards.Estate];
  expect(ai.playValue(state, cards.ShantyTown, state.current)).toBe(970);

  // Actions in hand
  state.current.hand = [cards.Copper, cards.Copper, cards.Village];

  // ... single action
  state.current.actions = 1;
  expect(ai.playValue(state, cards.ShantyTown, state.current)).toBe(340);

  // ... multiple actions
  state.current.actions = 2;
  expect(ai.playValue(state, cards.ShantyTown, state.current)).toBe(70);

  // Make sure Shanty Town is not considered as in hand
  state.current.hand = [cards.Copper, cards.ShantyTown, cards.Copper];
  state.current.actions = 2;
  expect(ai.playValue(state, cards.ShantyTown, state.current)).toBe(970);
});

test('Fallback playValue function -> Tournament', () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai]);

  // No province in hand
  state.current.hand = [cards.Copper, cards.Estate];
  expect(ai.playValue(state, cards.Tournament, state.current)).toBe(360);

  // 3 provinces in hand
  state.current.hand = [cards.Province, cards.Province, cards.Province];
  expect(ai.playValue(state, cards.Tournament, state.current)).toBe(960);
});

test('Fallback playValue function -> Library', () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai]);

  // ... as a terminal
  state.current.actions = 1;
  state.current.hand = [
    cards.Copper, cards.Copper, cards.Copper, cards.Copper, cards.Copper, cards.Copper, cards.Copper, cards.Copper
  ];

  expect(ai.playValue(state, cards.Library, state.current)).toBe(20);
  state.current.hand.pop();
  expect(ai.playValue(state, cards.Library, state.current)).toBe(101);
  state.current.hand.pop();
  expect(ai.playValue(state, cards.Library, state.current)).toBe(118);
  state.current.hand.pop();
  expect(ai.playValue(state, cards.Library, state.current)).toBe(192);
  state.current.hand.pop();
  expect(ai.playValue(state, cards.Library, state.current)).toBe(210);
  state.current.hand.pop();
  expect(ai.playValue(state, cards.Library, state.current)).toBe(260);
  state.current.hand.pop();
  expect(ai.playValue(state, cards.Library, state.current)).toBe(260);
  state.current.hand.pop();
  expect(ai.playValue(state, cards.Library, state.current)).toBe(260);
  state.current.hand.pop();
  expect(ai.playValue(state, cards.Library, state.current)).toBe(260);

  // ... as a non-terminal
  state.current.actions = 2;
  state.current.hand = [
    cards.Copper, cards.Copper, cards.Copper, cards.Copper, cards.Copper, cards.Copper, cards.Copper, cards.Copper
  ];

  expect(ai.playValue(state, cards.Library, state.current)).toBe(20);
  state.current.hand.pop();
  expect(ai.playValue(state, cards.Library, state.current)).toBe(101);
  state.current.hand.pop();
  expect(ai.playValue(state, cards.Library, state.current)).toBe(420);
  state.current.hand.pop();
  expect(ai.playValue(state, cards.Library, state.current)).toBe(620);
  state.current.hand.pop();
  expect(ai.playValue(state, cards.Library, state.current)).toBe(695);
  state.current.hand.pop();
  expect(ai.playValue(state, cards.Library, state.current)).toBe(955);
  state.current.hand.pop();
  expect(ai.playValue(state, cards.Library, state.current)).toBe(955);
  state.current.hand.pop();
  expect(ai.playValue(state, cards.Library, state.current)).toBe(955);
  state.current.hand.pop();
  expect(ai.playValue(state, cards.Library, state.current)).toBe(955);
});

test('Fallback playValue function -> Throne Room', () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai]);

  // Another action in hand
  state.current.hand = [cards.ThroneRoom, cards.Village];
  expect(ai.playValue(state, cards.ThroneRoom, state.current)).toBe(920);

  // No other action in hand
  state.current.hand = [cards.ThroneRoom, cards.Province, cards.Province];
  expect(ai.playValue(state, cards.ThroneRoom, state.current)).toBe(-50);
});

test('Fallback playValue function -> King\'s Court', () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai]);

  // Another action in hand
  state.current.hand = [cards.KingsCourt, cards.Village];
  expect(ai.playValue(state, cards.KingsCourt, state.current)).toBe(910);

  // No other action in hand
  state.current.hand = [cards.KingsCourt, cards.Province, cards.Province];
  expect(ai.playValue(state, cards.KingsCourt, state.current)).toBe(390);
});

test('Fallback playValue function -> Lookout', () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai]);

  // Not in endgame yet
  state.gainsToEndGame = jest.fn(() => 6);
  state.current.draw = [];
  expect(ai.playValue(state, cards.Lookout, state.current)).toBe(895);

  // Curse in deck
  state.gainsToEndGame = jest.fn(() => 1);
  state.current.draw = [cards.Curse];
  expect(ai.playValue(state, cards.Lookout, state.current)).toBe(895);

  // Otherwise
  state.gainsToEndGame = jest.fn(() => 1);
  state.current.draw = [];
  expect(ai.playValue(state, cards.Lookout, state.current)).toBe(-5);
});

test('Fallback playValue function -> Conspirator', () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai]);

  // It it activates
  state.current.inPlay = [new Card(), new Card()];
  expect(ai.playValue(state, cards.Conspirator, state.current)).toBe(760);

  // Multiple actions available
  state.current.inPlay = [];
  state.current.actions = 2;
  expect(ai.playValue(state, cards.Conspirator, state.current)).toBe(10);

  // Single action
  state.current.inPlay = [];
  state.current.actions = 1;
  expect(ai.playValue(state, cards.Conspirator, state.current)).toBe(124);
});

test('Fallback playValue function -> Great Hall', () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai]);

  // With Crossroads
  state.current.hand = [cards.Crossroads];
  expect(ai.playValue(state, cards.GreatHall, state.current)).toBe(520);

  // Without
  state.current.hand = [];
  expect(ai.playValue(state, cards.GreatHall, state.current)).toBe(742);
});

test('Fallback playValue function -> Watchtower', () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai]);

  // With extra actions
  state.current.hand = [cards.Copper, cards.Copper, cards.Copper];
  state.current.actions = 2;
  expect(ai.playValue(state, cards.Watchtower, state.current)).toBe(650);

  // Without + big draw
  state.current.hand = [];
  state.current.actions = 1;
  expect(ai.playValue(state, cards.Watchtower, state.current)).toBe(196);

  // Without + small draw
  state.current.hand = [cards.Copper, cards.Copper, cards.Copper, cards.Copper];
  state.current.actions = 1;
  expect(ai.playValue(state, cards.Watchtower, state.current)).toBe(190);

  // Otherwise
  state.current.hand = [cards.Copper, cards.Copper, cards.Copper, cards.Copper, cards.Copper];
  state.current.actions = 1;
  expect(ai.playValue(state, cards.Watchtower, state.current)).toBe(-1);
});

test('Fallback playValue function -> Terminal draw', () => {
  const ai = new BasicAI();
  const state = new State();
  const hypothetical = new BasicAction();

  hypothetical.cards = 10;
  state.setUp([ai, ai]);

  const testCards = [
    hypothetical,
    cards.Oracle
  ];

  for (let i = 0; i < testCards.length; i++) {
    let actualValue;

    // With extra actions
    state.current.actions = 2;

    actualValue = ai.playValue(state, testCards[i], state.current);
    expect(actualValue).toBeGreaterThanOrEqual(600);
    expect(actualValue).toBeLessThan(700);

    // Without
    state.current.actions = 1;
    actualValue = ai.playValue(state, testCards[i], state.current);
    expect(actualValue).toBeGreaterThanOrEqual(180);
    expect(actualValue).toBeLessThan(290);
  }
});

test('Fallback playValue function -> Crossroads', () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai]);

  // With Crossroads in play
  state.current.inPlay = [cards.Crossroads];
  expect(ai.playValue(state, cards.Crossroads, state.current)).toBe(298);

  // Without
  state.current.inPlay = [];
  expect(ai.playValue(state, cards.Crossroads, state.current)).toBe(580);
});

test('Fallback playValue function -> Treasure Map', () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai]);

  // With 2+ Treasure Maps in hand
  state.current.hand = [cards.TreasureMap, cards.TreasureMap];
  expect(ai.playValue(state, cards.TreasureMap, state.current)).toBe(294);

  // Getting rid of unnecesary TM
  state.current.draw = [cards.Gold, cards.Gold, cards.Gold, cards.Gold];
  state.current.hand = [cards.TreasureMap];
  expect(ai.playValue(state, cards.TreasureMap, state.current)).toBe(90);

  // Failed Treasure Map
  state.current.draw = [cards.TreasureMap];
  state.current.hand = [cards.TreasureMap];
  expect(ai.playValue(state, cards.TreasureMap, state.current)).toBe(-40);
});

test('Fallback playValue function -> Explorer', () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai]);

  // With Province in hand
  state.current.hand = [cards.Province];
  expect(ai.playValue(state, cards.Explorer, state.current)).toBe(282);

  // Getting rid of unnecesary TM
  state.current.hand = [];
  expect(ai.playValue(state, cards.Explorer, state.current)).toBe(166);
});

test('Fallback playValue function -> Coppersmith', () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai]);

  // With no Coppers
  state.current.hand = [];
  expect(ai.playValue(state, cards.Coppersmith, state.current)).toBe(105);

  // With 1 Copper
  state.current.hand = [cards.Copper];
  expect(ai.playValue(state, cards.Coppersmith, state.current)).toBe(105);

  // With 2 Coppers
  state.current.hand = [cards.Copper, cards.Copper];
  expect(ai.playValue(state, cards.Coppersmith, state.current)).toBe(156);

  // With more Coppers
  state.current.hand = [cards.Copper, cards.Copper, cards.Copper, cards.Copper];
  expect(ai.playValue(state, cards.Coppersmith, state.current)).toBe(213);
});

test('Fallback playValue function -> Baron', () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai]);

  // With Estate in hand
  state.current.hand = [cards.Estate];
  expect(ai.playValue(state, cards.Baron, state.current)).toBe(184);

  // Without but wants to gain Estate
  state.current.hand = [];
  ai.gainValue = () => 1;
  expect(ai.playValue(state, cards.Baron, state.current)).toBe(5);

  // Without and does not want to gain Estate
  state.current.hand = [];
  ai.gainValue = () => -1;
  expect(ai.playValue(state, cards.Baron, state.current)).toBe(-5);
});
