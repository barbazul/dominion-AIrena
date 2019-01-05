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
