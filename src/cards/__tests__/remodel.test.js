import BasicAI, { CHOICE_UPGRADE } from '../../agents/basicAI';
import cards from '../../game/cards';
import State from '../../game/state';
import Remodel from '../remodel';

const muteConfig = { log: () => {}, warn: () => {} };

test('Remodel card definition', () => {
  const card = new Remodel();

  expect(card.toString()).toBe('Remodel');
  expect(card.cost).toBe(4);
  expect(card.exactCostUpgrade).toBe(false);
});

test('playEffect calls for an upgrade choice', () => {
  const card = new Remodel();
  const state = new State();
  const expectedChoices = [
    { trash: [cards.Copper], gain: [cards.Copper] },
    { trash: [cards.Copper], gain: [cards.Estate] },
    { trash: [cards.Copper], gain: [cards.Curse] },
    { trash: [cards.Estate], gain: [cards.Copper] },
    { trash: [cards.Estate], gain: [cards.Silver] },
    { trash: [cards.Estate], gain: [cards.Estate] },
    { trash: [cards.Estate], gain: [cards.Curse] }
  ];

  const unexpectedChoices = [
    { trash: [cards.Copper], gain: [cards.Duchy] },
    { trash: [cards.Copper], gain: [cards.Province] },
    { trash: [cards.Copper], gain: [cards.Silver] },
    { trash: [cards.Copper], gain: [cards.Gold] },
    { trash: [cards.Estate], gain: [cards.Duchy] },
    { trash: [cards.Estate], gain: [cards.Province] },
    { trash: [cards.Estate], gain: [cards.Gold] }
  ];

  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  state.current.agent.choose = jest.fn(state.current.agent.choose);
  state.current.hand = [cards.Copper, cards.Estate];
  card.playEffect(state);

  expect(state.current.agent.choose).toHaveBeenCalledWith(CHOICE_UPGRADE, state, expect.arrayContaining(expectedChoices));
  expect(state.current.agent.choose).toHaveBeenCalledWith(CHOICE_UPGRADE, state, expect.not.arrayContaining(unexpectedChoices));
});

test('Does not allow to gain from an empty pile', () => {
  const card = new Remodel();
  const state = new State();
  const expectedChoices = [
    { trash: [cards.Copper], gain: [cards.Copper] },
    { trash: [cards.Copper], gain: [cards.Estate] },
    { trash: [cards.Copper], gain: [cards.Curse] },
    { trash: [cards.Estate], gain: [cards.Copper] },
    { trash: [cards.Estate], gain: [cards.Estate] },
    { trash: [cards.Estate], gain: [cards.Curse] }
  ];

  const unexpectedChoices = [
    { trash: [cards.Copper], gain: [cards.Duchy] },
    { trash: [cards.Copper], gain: [cards.Province] },
    { trash: [cards.Copper], gain: [cards.Silver] },
    { trash: [cards.Copper], gain: [cards.Gold] },
    { trash: [cards.Estate], gain: [cards.Duchy] },
    { trash: [cards.Estate], gain: [cards.Province] },
    { trash: [cards.Estate], gain: [cards.Silver] },
    { trash: [cards.Estate], gain: [cards.Gold] }
  ];

  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  state.current.agent.choose = jest.fn(state.current.agent.choose);
  state.current.hand = [cards.Copper, cards.Estate];
  state.kingdom.Silver = 0;
  card.playEffect(state);

  expect(state.current.agent.choose).toHaveBeenCalledWith(CHOICE_UPGRADE, state, expect.arrayContaining(expectedChoices));
  expect(state.current.agent.choose).toHaveBeenCalledWith(CHOICE_UPGRADE, state, expect.not.arrayContaining(unexpectedChoices));
});

test('Cards are trashed and gained as chosen', () => {
  const card = new Remodel();
  const state = new State();

  state.setUp([new BasicAI(), new BasicAI()], muteConfig);

  state.current.agent.choose = jest.fn(() => {
    return { trash: [cards.Estate], gain: [cards.Curse] };
  });

  state.current.hand = [cards.Estate];
  state.doTrash = jest.fn(() => {});
  state.gainCard = jest.fn(() => {});
  card.playEffect(state);

  expect(state.current.agent.choose).toHaveBeenCalled();
  expect(state.doTrash).toHaveBeenCalledWith(state.current, cards.Estate);
  expect(state.gainCard).toHaveBeenCalledWith(state.current, cards.Curse, 'discard');
});

test('Does nothing on empty hand', () => {
  const card = new Remodel();
  const state = new State();

  state.setUp([new BasicAI(), new BasicAI()], muteConfig);

  state.current.agent.choose = jest.fn(() => {});

  state.current.hand = [];
  state.current.discard = [];
  card.playEffect(state);

  expect(state.current.agent.choose).not.toHaveBeenCalled();
  expect(state.current.hand).toHaveLength(0);
  expect(state.current.discard).toHaveLength(0);
});

test('costFunction', () => {
  const card = new Remodel();

  expect(card.costFunction(0)).toBe(2);
  expect(card.costFunction(1)).toBe(3);
  expect(card.costFunction(2)).toBe(4);
});

test('upgradeChoices returns emptyList without cardList', () => {
  const card = new Remodel();
  const state = new State();

  state.setUp([new BasicAI(), new BasicAI()], muteConfig);

  expect(card.upgradeChoices(state, []).length).toBe(0);
});

test('upgradeChoices returns valid cards', () => {
  const card = new Remodel();
  const state = new State();

  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  state.kingdom = {
    'Estate': 8, 'Duchy': 8, 'Province': 8,
    'Copper': 100, 'Silver': 100, 'Gold': 100
  };

  const trashables = [ cards.Estate ];
  const choices = card.upgradeChoices(state, trashables);

  expect(choices).toContainEqual({ gain: [ cards.Silver ], trash: [ cards.Estate ] });
  expect(choices).toContainEqual({ gain: [ cards.Copper ], trash: [ cards.Estate ] });
  expect(choices).not.toContainEqual({ gain: [ cards.Gold ], trash: [ cards.Estate ] });
});

test('upgradeChoices ignores duplicates', () => {
  const card = new Remodel();
  const state = new State();

  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  state.kingdom = {
    'Estate': 8, 'Duchy': 8, 'Province': 8,
    'Copper': 100, 'Silver': 100, 'Gold': 100
  };

  const trashables = [cards.Estate, cards.Estate];
  const choices = card.upgradeChoices(state, trashables);

  expect(
    choices.filter(
      choice => choice.gain[0] === cards.Silver
        && choice.trash[0] === cards.Estate
    ).length
  )
    .toBe(1);
});

test('upgradeChoices ignores empty piles', () => {
  const card = new Remodel();
  const state = new State();

  state.setUp([new BasicAI(), new BasicAI()], muteConfig);
  state.kingdom = {
    'Estate': 0, 'Duchy': 8, 'Province': 8,
    'Copper': 100, 'Silver': 100, 'Gold': 100
  };

  const trashables = [cards.Estate];
  const choices = card.upgradeChoices(state, trashables);

  expect(choices).not.toContainEqual({ gain: [ cards.Estate ], trash: [ cards.Estate ] });
});
