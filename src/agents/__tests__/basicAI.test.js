import BasicAction from '../../cards/basicAction';
import Card from '../../cards/card';
import cards from '../../game/cards';
import Player from '../../game/player';
import State, { PHASE_ACTION, PHASE_BUY } from '../../game/state';
import BasicAI, { CHOICE_DISCARD } from '../basicAI';

const muteConfig = { log: () => {}, warn: () => {} };

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

  state.setUp([ai1, ai2], muteConfig);
  expect(() => {
    ai3.myPlayer(state);
  }).toThrow();
});

test('myPlayer returns the correct player', () => {
  const ai1 = new BasicAI();
  const ai2 = new BasicAI();
  const state = new State();

  state.setUp([ai1, ai2], muteConfig);
  expect(ai1.myPlayer(state).agent).toBe(ai1);
  expect(ai1.myPlayer(state).agent).not.toBe(ai2);
  expect(ai2.myPlayer(state).agent).toBe(ai2);
  expect(ai2.myPlayer(state).agent).not.toBe(ai1);
});

test('Choose null when there are no choices', () => {
  const ai1 = new BasicAI();
  const ai2 = new BasicAI();
  const state = new State();

  state.setUp([ ai1, ai2 ], muteConfig);
  expect(ai1.choose(CHOICE_DISCARD, state, [])).toBeNull();
});

test('Choose only choice', () => {
  const ai1 = new BasicAI();
  const ai2 = new BasicAI();
  const state = new State();
  const card1 = new Card();

  state.setUp([ ai1, ai2 ], muteConfig);
  ai1.fakeValue = () => -Infinity;
  expect(ai1.choose('fake', state, [card1])).toBe(card1);
});

test('Default discardPriority', () => {
  const ai = new BasicAI();
  const state = new State();
  const player = new Player(ai, () => {});
  const priority = ai.discardPriority(state, player);

  expect(priority.length).toBeGreaterThan(0);
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

  state.setUp([ ai1, ai2 ], muteConfig);
  ai1.discardPriority = () => [ 'Skip this', 'Choose this', 'Ignore this' ];
  card1.name = 'Ignore this';
  card2.name = 'Choose this';
  expect(ai1.choose('discard', state, [ card1, card2 ])).toEqual(card2);
});

test('Return null when its legal and preferable', () => {
  const ai1 = new BasicAI();
  const ai2 = new BasicAI();
  const state = new State();

  state.setUp([ ai1, ai2 ], muteConfig);
  ai1.discardPriority = () => [ 'Skip this', null, 'Ignore this' ];
  expect(ai1.choose('discard', state, [ 'Ignore this', null ])).toBeNull();
});

test('Choice value of null is 0', () => {
  const ai1 = new BasicAI();
  const ai2 = new BasicAI();
  const state = new State();

  state.setUp([ ai1, ai2 ], muteConfig);
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

  state.setUp([ ai1, ai2 ], muteConfig);
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

  state.setUp([ ai1, ai2 ], muteConfig);
  player = ai1.myPlayer(state);
  player.actions = 0;
  state.current = player;
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

  state.setUp([ ai1, ai2 ], muteConfig);
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

  state.setUp([ ai1, ai2 ], { log: () => {}, warn: warnFunction });
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

  state.setUp([ ai1, ai2 ], muteConfig);
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

  state.setUp([ ai1, ai2 ], muteConfig);
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

  state.setUp([ ai1, ai2 ], muteConfig);
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

  state.setUp([ ai1, ai2 ], muteConfig);
  ai1.fakeValue = () => -Infinity;

  expect(() => {
    ai1.choose('fake', state, [card1, card2]);
  }).toThrow('BasicAI somehow failed to make a choice');
});

test('Choose null if available and AI cannot decide', () => {
  const ai1 = new BasicAI();
  const ai2 = new BasicAI();
  const state = new State();
  const card1 = new Card();
  const card2 = new Card();

  state.setUp([ ai1, ai2 ], muteConfig);
  ai1.fakeValue = () => -Infinity;

  expect(ai1.choose('fake', state, [card1, card2, null])).toBeNull();
});

test('Default gainPriority', () => {
  const ai1 = new BasicAI();
  const ai2 = new BasicAI();
  const state = new State();

  state.setUp([ai1, ai2], muteConfig);
  state.current.countInDeck = jest.fn(() => 1);
  state.countInSupply = jest.fn(() => 8);
  state.gainsToEndGame = jest.fn(() => 8);

  expect(state.current.agent.gainPriority(state, state.current).map(card => card.toString())).toEqual(
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

  state.setUp([ai1, ai2], muteConfig);
  state.current.countInDeck = jest.fn(() => 0);
  state.countInSupply = jest.fn(() => 8);
  state.gainsToEndGame = jest.fn(() => 8);

  expect(state.current.agent.gainPriority(state, state.current)).not.toContain('Colony');
});

test('Prefer Province with less than 7 colonies', () => {
  const ai1 = new BasicAI();
  const ai2 = new BasicAI();
  const state = new State();

  state.setUp([ai1, ai2], muteConfig);
  state.current.countInDeck = jest.fn(() => 0);
  state.countInSupply = jest.fn(() => 6);
  state.gainsToEndGame = jest.fn(() => 8);

  expect(state.current.agent.gainPriority(state, state.current).map(card => card.toString()))
    .toContain('Province');
});

test('Prefer Duchy with less than 6 gains to end game', () => {
  const ai1 = new BasicAI();
  const ai2 = new BasicAI();
  const state = new State();

  state.setUp([ai1, ai2], muteConfig);
  state.current.countInDeck = jest.fn(() => 0);
  state.countInSupply = jest.fn(() => 6);
  state.gainsToEndGame = jest.fn(() => 5);

  expect(state.current.agent.gainPriority(state, state.current).map(card => card.toString()))
    .toContain('Duchy');
});

test('Prefer Estate with less than 3 gains to end game', () => {
  const ai1 = new BasicAI();
  const ai2 = new BasicAI();
  const state = new State();

  state.setUp([ai1, ai2], muteConfig);
  state.current.countInDeck = jest.fn(() => 0);
  state.countInSupply = jest.fn(() => 6);
  state.gainsToEndGame = jest.fn(() => 2);

  expect(state.current.agent.gainPriority(state, state.current).map(card => card.toString()))
    .toContain('Estate');
});

test('Prefer Copper with less than 4 gains to end game', () => {
  const ai1 = new BasicAI();
  const ai2 = new BasicAI();
  const state = new State();

  state.setUp([ai1, ai2], muteConfig);
  state.current.countInDeck = jest.fn(() => 0);
  state.countInSupply = jest.fn(() => 6);
  state.gainsToEndGame = jest.fn(() => 3);

  expect(state.current.agent.gainPriority(state, state.current).map(card => card.toString()))
    .toContain('Copper');
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

test('Fallback playValue function -> Static values', () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai], muteConfig);

  // Base treasures
  expect(ai.playValue(state, cards.Festival, state.current)).toBe(845);
  expect(ai.playValue(state, cards.Village, state.current)).toBe(820);
  expect(ai.playValue(state, cards.Laboratory, state.current)).toBe(782);
  expect(ai.playValue(state, cards.Market, state.current)).toBe(775);
  expect(ai.playValue(state, cards.Cellar, state.current)).toBe(450);
});

test('Fallback playValue function -> Basic treasures', () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai], muteConfig);

  // Base treasures
  expect(ai.playValue(state, cards.Copper, state.current)).toBe(101);
  expect(ai.playValue(state, cards.Silver, state.current)).toBe(102);
  expect(ai.playValue(state, cards.Gold, state.current)).toBe(103);
});

test.todo('Fallback playValue function -> Menagerie'/*, () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai], muteConfig);

  // No duplicates in hand
  state.current.hand = [cards.Copper, cards.Estate];
  expect(ai.playValue(state, cards.Menagerie, state.current)).toBe(980);

  // Duplicates in hand
  state.current.hand = [cards.Copper, cards.Estate, cards.Estate];
  expect(ai.playValue(state, cards.Menagerie, state.current)).toBe(340);

  // 2 Menageries still trigger as one will leave hand
  state.current.hand = [cards.Menagerie, cards.Menagerie];
  expect(ai.playValue(state, cards.Menagerie, state.current)).toBe(980);
} */);

test.todo('Fallback playValue function -> Shanty Town'/*, () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai], muteConfig);

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
} */);

test.todo('Fallback playValue function -> Tournament'/*, () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai], muteConfig);

  // No province in hand
  state.current.hand = [cards.Copper, cards.Estate];
  expect(ai.playValue(state, cards.Tournament, state.current)).toBe(360);

  // 3 provinces in hand
  state.current.hand = [cards.Province, cards.Province, cards.Province];
  expect(ai.playValue(state, cards.Tournament, state.current)).toBe(960);
} */);

test('Fallback playValue function -> Library', () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai], muteConfig);

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

  state.setUp([ai, ai], muteConfig);

  // Another action in hand
  state.current.hand = [cards['Throne Room'], cards.Village];
  expect(ai.playValue(state, cards['Throne Room'], state.current)).toBe(920);

  // No other action in hand
  state.current.hand = [cards['Throne Room'], cards.Province, cards.Province];
  expect(ai.playValue(state, cards['Throne Room'], state.current)).toBe(-50);
});

test.todo('Fallback playValue function -> King\'s Court'/*, () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai], muteConfig);

  // Another action in hand
  state.current.hand = [cards.KingsCourt, cards.Village];
  expect(ai.playValue(state, cards.KingsCourt, state.current)).toBe(910);

  // No other action in hand
  state.current.hand = [cards.KingsCourt, cards.Province, cards.Province];
  expect(ai.playValue(state, cards.KingsCourt, state.current)).toBe(390);
} */);

test.todo('Fallback playValue function -> Lookout'/*, () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai], muteConfig);

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
} */);

test.todo('Fallback playValue function -> Conspirator'/*, () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai], muteConfig);

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
} */);

test.todo('Fallback playValue function -> Great Hall'/*, () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai], muteConfig);

  // With Crossroads
  state.current.hand = [cards.Crossroads];
  expect(ai.playValue(state, cards.GreatHall, state.current)).toBe(520);

  // Without
  state.current.hand = [];
  expect(ai.playValue(state, cards.GreatHall, state.current)).toBe(742);
} */);

test.todo('Fallback playValue function -> Watchtower'/*, () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai], muteConfig);

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
} */);

test('Fallback playValue function -> Cantrips', () => {
  const ai = new BasicAI();
  const state = new State();
  const hypothetical = new BasicAction();

  hypothetical.actions = 1;
  state.setUp([ai, ai], muteConfig);

  const testCards = [
    hypothetical,
    cards.Harbinger
  ];

  for (let i = 0; i < testCards.length; i++) {
    let actualValue;

    actualValue = ai.playValue(state, testCards[i], state.current);
    expect(actualValue).toBeGreaterThanOrEqual(700);
    expect(actualValue).toBeLessThan(800);
  }
});

test('Fallback playValue function -> Terminal draw', () => {
  const ai = new BasicAI();
  const state = new State();
  const hypothetical = new BasicAction();

  hypothetical.cards = 10;
  state.setUp([ai, ai], muteConfig);

  const testCards = [
    hypothetical,
    cards.Smithy
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

test('Fallback playValue function -> Other terminals', () => {
  const ai = new BasicAI();
  const state = new State();
  const hypothetical = new BasicAction();

  hypothetical.cards = 0;
  hypothetical.actions = 0;
  state.setUp([ai, ai], muteConfig);

  const testCards = [
    hypothetical,
    cards.Vassal
  ];

  for (let i = 0; i < testCards.length; i++) {
    let actualValue;

    actualValue = ai.playValue(state, testCards[i], state.current);
    expect(actualValue).toBeGreaterThanOrEqual(100);
    expect(actualValue).toBeLessThan(200);
  }
});

test.todo('Fallback playValue function -> Crossroads'/*, () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai], muteConfig);

  // With Crossroads in play
  state.current.inPlay = [cards.Crossroads];
  expect(ai.playValue(state, cards.Crossroads, state.current)).toBe(298);

  // Without
  state.current.inPlay = [];
  expect(ai.playValue(state, cards.Crossroads, state.current)).toBe(580);
} */);

test.todo('Fallback playValue function -> Treasure Map'/*, () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai], muteConfig);

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
} */);

test.todo('Fallback playValue function -> Explorer'/*, () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai], muteConfig);

  // With Province in hand
  state.current.hand = [cards.Province];
  expect(ai.playValue(state, cards.Explorer, state.current)).toBe(282);

  // Getting rid of unnecesary TM
  state.current.hand = [];
  expect(ai.playValue(state, cards.Explorer, state.current)).toBe(166);
} */);

test.todo('Fallback playValue function -> Coppersmith'/*, () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai], muteConfig);

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
} */);

test.todo('Fallback playValue function -> Baron'/*, () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai], muteConfig);

  // With Estate in hand
  state.current.hand = [cards.Estate];
  expect(ai.playValue(state, cards.Baron, state.current)).toBe(184);

  // Without but wants to gain Estate
  state.current.hand = [];
  ai.cardInDeckValue = () => 1;
  expect(ai.playValue(state, cards.Baron, state.current)).toBe(5);

  // Without and does not want to gain Estate
  state.current.hand = [];
  ai.cardInDeckValue = () => -1;
  expect(ai.playValue(state, cards.Baron, state.current)).toBe(-5);
} */);

test('Fallback playValue function -> Chapel', () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai], muteConfig);

  // Wants to trash
  ai.wantsToTrash = () => true;
  expect(ai.playValue(state, cards.Chapel, state.current)).toBe(146);

  // Doesn't want to trash
  ai.wantsToTrash = () => false;
  expect(ai.playValue(state, cards.Chapel, state.current)).toBe(30);
});

test('playValue -> Edge Cases', () => {
  const ai = new BasicAI();
  const state = new State();
  const card = new Card();

  card.types = [];
  state.setUp([ai, ai], muteConfig);
  expect(ai.playValue(state, card, state.current)).toBe(-1);
});

test('Default trashPriority', () => {
  const ai = new BasicAI();
  const state = new State();
  const player = new Player(ai, () => {});
  const priority = ai.trashPriority(state, player);

  expect(priority.length).toBeGreaterThan(0);
});

test('wantsToTrash returns 0 with empty hand', () => {
  const ai = new BasicAI();
  const player = new Player(ai, () => {});
  const state = new State();

  player.hand = [];

  expect(ai.wantsToTrash(state, player)).toBe(0);
});

test('wantsToTrash returns 0 when ai does not want to trash', () => {
  const ai = new BasicAI();
  const player = new Player(ai, () => {});
  const state = new State();

  player.hand = [new Card()];
  ai.choose = () => null;

  expect(ai.wantsToTrash(state, player)).toBe(0);
});

test('wantsToTrash returns the number of cards to trash', () => {
  const ai = new BasicAI();
  const player = new Player(ai, () => {});
  const state = new State();
  let trashable = new Card();
  let untrashable = new Card();

  trashable.name = 'Trashable';
  untrashable.name = 'Not Trashable';
  player.hand = [trashable, trashable];

  ai.choose = (type, state, options) => {
    const values = {
      'Trashable': true,
      'Not Trashable': false
    };

    for (let card of options) {
      if (values[card]) {
        return card;
      }
    }

    return null;
  };

  expect(ai.wantsToTrash(state, player)).toBe(2);
});

test('topdeckPriority prioritizes actions thant won\'t be played by play value', () => {
  const state = new State();
  const ai = new BasicAI();
  const action1 = new BasicAction();
  const action2 = new BasicAction();
  const action3 = new BasicAction();
  let priority;

  state.setUp([ai, ai], muteConfig);

  // Only 1 action left and 3 terminals in hand
  state.current.actions = 1;
  state.current.hand = [action1, action2, action3];
  action1.name = 'Action 1';
  action2.name = 'Action 2'; // Second best, save for next turn
  action3.name = 'Action 3'; // Best card, I want to keep it

  ai.coinLossMargin = () => 99;
  ai.getChoiceValue = jest.fn((type, state, card) => {
    const values = {
      'Action 1': 0,
      'Action 2': 0.5,
      'Action 3': 1
    };

    return values[card.toString()];
  });

  priority = ai.topdeckPriority(state, state.current);
  expect(priority.map(card => card.toString())).toEqual(['Action 2', 'Action 1']);
});

test('topdeckPriority prefers most valuable treasures', () => {
  const state = new State();
  const ai = new BasicAI();
  let priority;

  state.setUp([ai, ai], muteConfig);
  state.current.actions = 0;
  state.current.hand = [cards.Copper, cards.Silver];
  ai.coinLossMargin = () => 99;
  priority = ai.topdeckPriority(state, state.current);
  expect(priority).toEqual([cards.Silver, cards.Copper]);
});

test('topdeckPriority skips duplicate treasures', () => {
  const state = new State();
  const ai = new BasicAI();
  let priority;

  state.setUp([ai, ai], muteConfig);
  state.current.actions = 0;
  state.current.hand = [cards.Copper, cards.Copper];
  ai.coinLossMargin = () => 99;
  priority = ai.topdeckPriority(state, state.current);
  expect(priority).toEqual([cards.Copper]);
});

test('topdeckPriority skips treasures that would hinder buy options', () => {
  const state = new State();
  const ai = new BasicAI();
  let priority;

  state.setUp([ai, ai], muteConfig);
  state.current.actions = 0;
  state.current.hand = [cards.Gold, cards.Silver, cards.Copper];
  ai.coinLossMargin = () => 2;
  priority = ai.topdeckPriority(state, state.current);
  expect(priority).toEqual([cards.Silver, cards.Copper]);
});

test('topdeckPriority skips treasures if there are action options', () => {
  const state = new State();
  const ai = new BasicAI();
  let priority;

  state.setUp([ai, ai], muteConfig);
  state.current.actions = 0;
  state.current.hand = [cards.Smithy, cards.Silver, cards.Copper];
  ai.coinLossMargin = () => 2;
  priority = ai.topdeckPriority(state, state.current);
  expect(priority).toEqual([cards.Smithy]);
});

test('topdeckPriority returns worst card if it doesn\'t want to save anything', () => {
  const state = new State();
  const ai = new BasicAI();
  let priority;

  state.setUp([ai, ai], muteConfig);
  state.current.actions = 1;
  state.current.hand = [cards.Village, cards.Gold, cards.Estate, cards.Curse];
  ai.coinLossMargin = () => 2;
  ai.choose = () => cards.Curse;
  priority = ai.topdeckPriority(state, state.current);
  expect(priority).toEqual([null, cards.Curse]);
});

test('topdeckValue forwards to discardValue', () => {
  const state = new State();
  const card = new Card();
  const ai = new BasicAI();
  const player = new Player(ai, () => {});

  ai.discardValue = jest.fn(ai.discardValue);
  ai.topdeckValue(state, card, player);

  expect(ai.discardValue).toHaveBeenCalledWith(state, card, player);
});

test('ChoiceToValue of null choice is always 0', () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai], muteConfig);
  expect(ai.choiceToValue('fake', state, null, state.current)).toBe(0);
});

test('ChoiceToValue returns position in priority list times 100', () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai], muteConfig);
  ai.fakePriority = () => [
    'Some card',
    'Another card',
    'My card',
    'Crappy card'
  ];

  expect(ai.choiceToValue('fake', state, 'My card', state.current)).toBe(200);
});

test('ChoiceToValue forwards to choiceValue when choice is not on list', () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai], muteConfig);
  ai.fakePriority = () => [
    'Some card',
    'Another card',
    'Crappy card'
  ];

  ai.getChoiceValue = jest.fn(() => 55);

  expect(ai.choiceToValue('fake', state, 'My card', state.current)).toBe(55);
  expect(ai.getChoiceValue).toHaveBeenCalledWith('fake', state, 'My card', state.current);
});

test('ChoiceToValue forwards to choiceValue when no priority list is available', () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai], muteConfig);

  ai.getChoiceValue = jest.fn(() => 55);

  expect(ai.choiceToValue('fake', state, 'My card', state.current)).toBe(55);
  expect(ai.getChoiceValue).toHaveBeenCalledWith('fake', state, 'My card', state.current);
});

test('CardInDeckValue returns gain value minus trash value', () => {
  const card = new Card();
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai], muteConfig);

  ai.choiceToValue = jest.fn((type) => {
    const values = {
      trash: 1,
      gain: 2
    };

    return values[type];
  });

  expect(ai.cardInDeckValue(state, card, state.current)).toBe(1);
});

test('CardInDeckValue powers the gain value on the endgame', () => {
  const card = new Card();
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai], muteConfig);
  state.gainsToEndGame = () => 2;

  ai.choiceToValue = jest.fn((type) => {
    const values = {
      trash: 1,
      gain: 2
    };

    return values[type];
  });

  expect(ai.cardInDeckValue(state, card, state.current)).toBe(7);
});

test('upgradeValue is the difference of between wanting the gained card and the trashed one', () => {
  const ai = new BasicAI();
  const state = new State();
  const choice = {
    trash: [cards.Estate],
    gain: [cards.Silver]
  };

  ai.cardInDeckValue = (state, card) => {
    const values = {
      Estate: 1,
      Silver: 5
    };

    return values[card.toString()];
  };

  state.setUp([ai, ai], muteConfig);
  expect(ai.upgradeValue(state, choice, state.current)).toBe(4);
});

test('Multiply value defaults to play value', () => {
  const ai = new BasicAI();
  const state = new State();
  const card = new BasicAction();

  card.name = 'Fake Card';
  state.setUp([ai, ai], muteConfig);
  ai.playValue = jest.fn(() => 1);

  ai.multiplyValue(state, card, state.current);

  expect(ai.playValue).toHaveBeenCalledWith(state, card, state.current);
});

/**
 *
 * @param card
 * @param extraActionsExpectedValue
 * @param terminalExpectedValue
 */
const assertMultiplyValue = function (card, extraActionsExpectedValue, terminalExpectedValue) {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai], muteConfig);

  // With extra actions
  state.current.actions = 2;
  expect(ai.multiplyValue(state, card, state.current)).toBe(extraActionsExpectedValue);

  // Without
  state.current.actions = 0;
  expect(ai.multiplyValue(state, card, state.current)).toBe(terminalExpectedValue);
};

test('Fallback multiplyValue function -> Smithy', () => {
  assertMultiplyValue(cards.Smithy, 1540, -1);
});

test('Fallback multiplyValue function -> Mine', () => {
  assertMultiplyValue(cards.Mine, 1260, -1);
});

test('Fallback multiplyValue function -> Witch', () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ai, ai], muteConfig);

  // With extra actions and curses left
  state.current.actions = 2;
  state.kingdom.Curse = 10;
  expect(ai.multiplyValue(state, cards.Witch, state.current)).toBe(1860);

  // Without
  state.current.actions = 0;
  expect(ai.multiplyValue(state, cards.Witch, state.current)).toBe(-1);
});

test('Fallback multiplyValue function -> Council Room', () => {
  assertMultiplyValue(cards['Council Room'], 1580, -1);
});

test('Fallback multiplyValue function -> Throne Room', () => {
  assertMultiplyValue(cards['Throne Room'], 1900, 1900);
});

test('Fallback multiplyValue function -> Bridge', () => {
  assertMultiplyValue(cards.Bridge, 1720, -1);
});

test('discardValue wants to discard actions only in own turn', () => {
  const ai1 = new BasicAI();
  const ai2 = new BasicAI();
  const state = new State();
  let player1, player2;

  state.setUp([ ai1, ai2 ], muteConfig);
  player1 = ai1.myPlayer(state);
  player1.actions = 0;
  player2 = ai2.myPlayer(state);
  state.current = player2;
  expect(ai1.discardValue(state, cards.Village, player1)).toBeLessThan(0);
});

test('discardValue tries not to draw dead actions', () => {
  const ai1 = new BasicAI();
  const ai2 = new BasicAI();
  const state = new State();
  let player1;

  state.setUp([ ai1, ai2 ], muteConfig);
  player1 = ai1.myPlayer(state);
  player1.actions = 1;
  player1.actionBalance = () => -1;
  state.current = player1;
  expect(ai1.discardValue(state, cards.Smithy, player1)).toBeGreaterThan(0);
});

test('goingGreen', () => {
  const state = new State();
  const ai = new BasicAI();

  state.setUp([ ai, ai ], muteConfig);

  state.current.draw = [ cards.Duchy, cards.Province, cards.Province ];
  expect(ai.goingGreen(state, state.current)).toBe(3);

  state.current.draw = [ cards.Duchy, cards.Duchy, cards.Province, cards.Province ];
  expect(ai.goingGreen(state, state.current)).toBe(4);

  state.current.draw = [ cards.Estate, cards.Estate, cards.Estate ];
  expect(ai.goingGreen(state, state.current)).toBe(0);
});

test('copy returns a different instance with a different name', () => {
  const ai = new BasicAI();
  const theClone = ai.copy();

  expect(theClone).toBeInstanceOf(BasicAI);
  expect(theClone).not.toBe(ai);
  expect(theClone.toString()).not.toBe(ai.toString());
});

test('fastForwardToBuy requires a hypothetical state', () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ ai, ai ], muteConfig);
  state.phase = PHASE_ACTION;

  expect(
    () => {
      ai.fastForwardToBuy(state, state.current);
    }
  ).toThrow();
});

test('fastForwardToBuy returns the state in buy phase', () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ ai, ai ], muteConfig);
  state.phase = PHASE_ACTION;
  state.depth = 1;

  expect(ai.fastForwardToBuy(state, state.current).phase).toBe(PHASE_BUY);
});

test('fastForwardToBuy keeps same cards in draw and discard', () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ ai, ai ], muteConfig);
  state.phase = PHASE_ACTION;
  state.depth = 1;

  // agent will play smithy and still not draw
  ai.playValue = () => 1;
  ai.playPriority = undefined;
  state.current.hand = [ cards.Smithy ];
  state.current.draw = [ cards.Copper, cards.Copper, cards.Copper ];
  state.current.discard = [ cards.Estate, cards.Estate, cards.Estate ];

  const drawBackup = state.current.draw.slice(0);
  const discardBackup = state.current.discard.slice(0);

  ai.fastForwardToBuy(state, state.current);

  expect(state.current.draw).toEqual(drawBackup);
  expect(state.current.discard).toEqual(discardBackup);
});

test('pessimisticBuyPhase returns a hypothetical state', () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ ai, ai ], muteConfig);

  const actual = ai.pessimisticBuyPhase(state);

  expect(actual).not.toBe(state);
  expect(actual.depth).toBeGreaterThan(state.depth);
});

test('pessimisticBuyPhase returns a state in buy phase', () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ ai, ai ], muteConfig);
  state.phase = PHASE_ACTION;
  state.current.hand = [ cards.Copper ];

  const actual = ai.pessimisticBuyPhase(state);

  expect(actual.phase).toBe(PHASE_BUY);
  expect(state.phase).toBe(PHASE_ACTION);
  expect(actual.current.coins).toBe(1);
});

test('pessimisticBuyPhase prevents recursion', () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ ai, ai ], muteConfig);
  state.phase = PHASE_ACTION;
  state.current.hand = [ cards.Copper, cards.Smithy ];

  ai.playValue = (state, card, my) => {
    ai.pessimisticBuyPhase(state);
    return 1;
  };

  const actual = ai.pessimisticBuyPhase(state);
  expect(actual.phase).toBe(PHASE_BUY);
});

test('coinLossMargin is 0 when no card is wanted', () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ ai, ai ], muteConfig);
  state.current.coins = 5;
  ai.gainPriority = () => [ null ];
  expect(ai.coinLossMargin(state)).toBe(0);
});

test('coinLossMargin is the difference between current coins and wished card cost', () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ ai, ai ], muteConfig);
  state.current.coins = 5;
  ai.gainPriority = () => [ cards.Silver, null ];
  expect(ai.coinLossMargin(state)).toBe(2);
});

test('coinGainMargin returns Infinity when no better card is wanted', () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ ai, ai ], muteConfig);
  state.current.coins = 3;
  ai.gainPriority = () => [ cards.Silver ];
  expect(ai.coinGainMargin(state)).toBe(Infinity);
});

test('coinGainMargin the missing coins for the next card in the list', () => {
  const ai = new BasicAI();
  const state = new State();

  state.setUp([ ai, ai ], muteConfig);
  state.current.coins = 3;
  ai.gainPriority = () => [ cards.Gold, cards.Silver ];
  expect(ai.coinGainMargin(state)).toBe(3);
});
