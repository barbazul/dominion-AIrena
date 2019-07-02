import BasicAI from '../../agents/basicAI';
import cards from '../../game/cards';
import State from '../../game/state';
import Duchy from '../duchy';
import Estate from '../estate';
import Mine from '../mine';
import Silver from '../silver';

test('Mine card definition', () => {
  const card = new Mine();

  expect(card.toString()).toBe('Mine');
  expect(card.cost).toBe(5);
});

test('Mine lets you get cards up to 3 coins over what you trashed', () => {
  const card = new Mine();

  expect(card.costFunction(0)).toBe(3);
});

test('Mine lets you trash treasures and gains treasures', () => {
  const card = new Mine();
  const state = new State();
  const estate = new Estate();
  const silver = new Silver();
  const duchy = new Duchy();

  expect(card.upgradeFilter(state, estate, silver)).toBe(false);
  expect(card.upgradeFilter(state, silver, duchy)).toBe(false);
});

test('playEffect calls for an upgrade choice', () => {
  const card = new Mine();
  const state = new State();
  const expectedChoices = [
    { trash: [cards.Copper], gain: [cards.Copper] },
    { trash: [cards.Copper], gain: [cards.Silver] }
  ];

  const unexpectedChoices = [
    { trash: [cards.Copper], gain: [cards.Curse] },
    { trash: [cards.Copper], gain: [cards.Estate] },
    { trash: [cards.Copper], gain: [cards.Duchy] },
    { trash: [cards.Copper], gain: [cards.Province] },
    { trash: [cards.Copper], gain: [cards.Gold] },
    { trash: [cards.Estate], gain: [cards.Curse] },
    { trash: [cards.Estate], gain: [cards.Estate] },
    { trash: [cards.Estate], gain: [cards.Duchy] },
    { trash: [cards.Estate], gain: [cards.Province] },
    { trash: [cards.Estate], gain: [cards.Copper] },
    { trash: [cards.Estate], gain: [cards.Silver] },
    { trash: [cards.Estate], gain: [cards.Gold] }
  ];

  state.setUp([new BasicAI(), new BasicAI()]);
  state.current.agent.choose = jest.fn(state.current.agent.choose);
  state.current.hand = [cards.Copper, cards.Estate];
  card.playEffect(state);

  expect(state.current.agent.choose).toHaveBeenCalledWith(
    BasicAI.CHOICE_UPGRADE,
    state,
    expect.arrayContaining(expectedChoices)
  );

  expect(state.current.agent.choose).toHaveBeenCalledWith(
    BasicAI.CHOICE_UPGRADE,
    state,
    expect.not.arrayContaining(unexpectedChoices)
  );
});

test('Does not allow to gain from an empty pile', () => {
  const card = new Mine();
  const state = new State();
  const expectedChoices = [
    { trash: [cards.Copper], gain: [cards.Copper] }
  ];

  const unexpectedChoices = [
    { trash: [cards.Copper], gain: [cards.Curse] },
    { trash: [cards.Copper], gain: [cards.Estate] },
    { trash: [cards.Copper], gain: [cards.Duchy] },
    { trash: [cards.Copper], gain: [cards.Province] },
    { trash: [cards.Copper], gain: [cards.Silver] },
    { trash: [cards.Copper], gain: [cards.Gold] },
    { trash: [cards.Estate], gain: [cards.Curse] },
    { trash: [cards.Estate], gain: [cards.Estate] },
    { trash: [cards.Estate], gain: [cards.Duchy] },
    { trash: [cards.Estate], gain: [cards.Province] },
    { trash: [cards.Estate], gain: [cards.Copper] },
    { trash: [cards.Estate], gain: [cards.Silver] },
    { trash: [cards.Estate], gain: [cards.Gold] }
  ];

  state.setUp([new BasicAI(), new BasicAI()]);
  state.current.agent.choose = jest.fn(state.current.agent.choose);
  state.current.hand = [cards.Copper, cards.Estate];
  state.kingdom.Silver = 0;
  card.playEffect(state);

  expect(state.current.agent.choose).toHaveBeenCalledWith(BasicAI.CHOICE_UPGRADE, state, expect.arrayContaining(expectedChoices));
  expect(state.current.agent.choose).toHaveBeenCalledWith(BasicAI.CHOICE_UPGRADE, state, expect.not.arrayContaining(unexpectedChoices));
});

test('Cards are trashed and gained as chosen', () => {
  const card = new Mine();
  const state = new State();

  state.setUp([new BasicAI(), new BasicAI()]);

  state.current.agent.choose = jest.fn(() => {
    return { trash: [cards.Copper], gain: [cards.Silver] };
  });

  state.current.hand = [cards.Copper];
  state.doTrash = jest.fn(() => {});
  state.gainCard = jest.fn(() => {});
  card.playEffect(state);

  expect(state.current.agent.choose).toHaveBeenCalled();
  expect(state.doTrash).toHaveBeenCalledWith(state.current, cards.Copper);
  expect(state.gainCard).toHaveBeenCalledWith(state.current, cards.Silver, 'hand');
});

test('Does nothing on empty hand', () => {
  const card = new Mine();
  const state = new State();

  state.setUp([new BasicAI(), new BasicAI()]);

  state.current.agent.choose = jest.fn(() => {});

  state.current.hand = [];
  state.current.discard = [];
  card.playEffect(state);

  expect(state.current.agent.choose).not.toHaveBeenCalled();
  expect(state.current.hand).toHaveLength(0);
  expect(state.current.discard).toHaveLength(0);
});
