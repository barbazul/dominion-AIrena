import CantripLurker from '../cantripLurker.js';
import BasicAI from '../../basicAI.js';
import cards from '../../../game/cards.js';
import State from '../../../game/state.js';

const muteConfig = { log: () => {} };

describe('CantripLurker', () => {
  let agent;
  let state;

  beforeEach(() => {
    agent = new CantripLurker();
    state = new State();
    state.setUp([agent, agent], muteConfig);
  });

  test('is an instance of BasicAI', () => {
    expect(agent).toBeInstanceOf(BasicAI);
  });

  test('requires Lurker', () => {
    expect(agent.requires).toEqual([cards.Lurker]);
  });

  describe('gainPriority', () => {
    test('always wants Province, Gold and Silver', () => {
      const priority = agent.gainPriority(state, state.current);

      expect(priority).toContain(cards.Province);
      expect(priority).toContain(cards.Gold);
      expect(priority).toContain(cards.Silver);
    });

    test('Province comes before Gold, Gold before Silver', () => {
      const priority = agent.gainPriority(state, state.current);

      expect(priority.indexOf(cards.Province)).toBeLessThan(priority.indexOf(cards.Gold));
      expect(priority.indexOf(cards.Gold)).toBeLessThan(priority.indexOf(cards.Silver));
    });

    test('wants Duchy when 5 or fewer gains to end game', () => {
      state.kingdom[cards.Province] = 4;

      const priority = agent.gainPriority(state, state.current);

      expect(priority).toContain(cards.Duchy);
    });

    test('does not want Duchy with more than 5 gains left', () => {
      const priority = agent.gainPriority(state, state.current);

      expect(priority).not.toContain(cards.Duchy);
    });

    test('wants Estate when 2 or fewer gains to end game', () => {
      state.kingdom[cards.Province] = 2;

      const priority = agent.gainPriority(state, state.current);

      expect(priority).toContain(cards.Estate);
    });

    test('does not want Estate with more than 2 gains left', () => {
      state.kingdom[cards.Province] = 4;

      const priority = agent.gainPriority(state, state.current);

      expect(priority).not.toContain(cards.Estate);
    });

    test('wants Lurker after Gold and before Silver when none in deck', () => {
      const priority = agent.gainPriority(state, state.current);

      expect(priority).toContain(cards.Lurker);
      expect(priority.indexOf(cards.Lurker)).toBeGreaterThan(priority.indexOf(cards.Gold));
      expect(priority.indexOf(cards.Lurker)).toBeLessThan(priority.indexOf(cards.Silver));
    });

    test('wants Lurker only once', () => {
      const priority = agent.gainPriority(state, state.current);

      expect(priority.filter(c => c === cards.Lurker)).toHaveLength(1);
    });

    test('does not want Lurker when already in deck', () => {
      state.current.discard.push(cards.Lurker);

      const priority = agent.gainPriority(state, state.current);

      expect(priority).not.toContain(cards.Lurker);
    });
  });

  describe('gainValue for cantrip actions (actions > 0)', () => {
    test('values Village by cost + cards + actions', () => {
      // Village: cost=3, cards=1, actions=2, coins=0, not an attack
      // Expected: 3 + 1 + 0 + 0 + 2 = 6
      expect(agent.gainValue(state, cards.Village, state.current)).toBe(6);
    });

    test('values Laboratory by cost + cards + actions', () => {
      // Laboratory: cost=5, cards=2, actions=1, coins=0, not an attack
      // Expected: 5 + 2 + 0 + 0 + 1 = 8
      expect(agent.gainValue(state, cards.Laboratory, state.current)).toBe(8);
    });

    test('values Lurker by cost + actions', () => {
      // Lurker: cost=2, cards=0, actions=1, coins=0, not an attack
      // Expected: 2 + 0 + 0 + 0 + 1 = 3
      expect(agent.gainValue(state, cards.Lurker, state.current)).toBe(3);
    });

    test('adds 1 bonus for attack cantrips', () => {
      const attackCantrip = {
        isAction: () => true,
        isAttack: () => true,
        getActions: () => 1,
        getCards: () => 1,
        getCost: () => 4,
        coins: 0
      };
      // Expected: 4 + 1 + 1 + 0 + 1 = 7
      expect(agent.gainValue(state, attackCantrip, state.current)).toBe(7);
    });

    test('includes coins in the value', () => {
      const cantrip = {
        isAction: () => true,
        isAttack: () => false,
        getActions: () => 1,
        getCards: () => 0,
        getCost: () => 3,
        coins: 2
      };
      // Expected: 3 + 0 + 0 + 2 + 1 = 6
      expect(agent.gainValue(state, cantrip, state.current)).toBe(6);
    });
  });

  describe('gainValue for terminal actions (actions = 0)', () => {
    test('values Smithy only by cards drawn', () => {
      // Smithy: cost=4, cards=3, actions=0
      // Expected: 3 (just cards drawn)
      expect(agent.gainValue(state, cards.Smithy, state.current)).toBe(3);
    });

    test('values Militia only by cards drawn', () => {
      // Militia: cost=4, cards=0, actions=0, coins=2, attack=true
      // Expected: 0 (cards drawn is 0)
      expect(agent.gainValue(state, cards.Militia, state.current)).toBe(0);
    });

    test('values Witch only by cards drawn', () => {
      // Witch: cost=5, cards=2, actions=0, attack=true
      // Expected: 2 (just cards drawn, attack bonus not applied for terminals)
      expect(agent.gainValue(state, cards.Witch, state.current)).toBe(2);
    });
  });

  describe('gainValue for non-action cards', () => {
    test('delegates Silver to parent', () => {
      const parent = new BasicAI();
      expect(agent.gainValue(state, cards.Silver, state.current))
        .toBe(parent.gainValue(state, cards.Silver, state.current));
    });

    test('delegates Gold to parent', () => {
      const parent = new BasicAI();
      expect(agent.gainValue(state, cards.Gold, state.current))
        .toBe(parent.gainValue(state, cards.Gold, state.current));
    });

    test('delegates Estate to parent', () => {
      const parent = new BasicAI();
      expect(agent.gainValue(state, cards.Estate, state.current))
        .toBe(parent.gainValue(state, cards.Estate, state.current));
    });
  });
});
