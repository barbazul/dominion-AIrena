import Bureaucrat from '../bureaucrat.js';
import State from '../../../game/state.js';
import cards from '../../../game/cards.js';

const muteConfig = {log: jest.fn()};

describe('DomSim Bureaurat bot', () => {
  const agent = new Bureaucrat();

  describe('Bureaucrat constructor', () => {
    expect(agent.name).toBe('Bureaucrat');
    expect(agent.requires).toContain(cards.Bureaucrat);
  });

  describe('Bureaucrat gainPriority', () => {
    test('gainPriority at game start', () => {
      const state = new State();

      state.setUp([agent, agent], muteConfig);

      const priority = agent.gainPriority(state, state.current);

      expect(priority).toHaveLength(4);
      expect(priority[0]).toBe(cards.Gold);
      expect(priority[1]).toBe(cards.Bureaucrat);
      expect(priority[2]).toBe(cards.Bureaucrat);
      expect(priority[3]).toBe(cards.Silver);
    });

    test('gainPriority wants Province when has Gold', () => {
      const agent = new Bureaucrat();
      const state = new State();

      state.setUp([agent, agent], muteConfig);
      state.current.draw = [cards.Gold];

      const priority = agent.gainPriority(state, state.current);

      expect(priority).toContain(cards.Province);
    });

    test('gainPriority wants Duchy when few Provinces remain', () => {
      const agent = new Bureaucrat();
      const state = new State();

      state.setUp([agent, agent], muteConfig);
      state.countInSupply = () => 5; // Few Provinces remain

      const priority = agent.gainPriority(state, state.current);

      expect(priority).toContain(cards.Duchy);
      expect(priority.filter(card => card === cards.Duchy)).toHaveLength(2);
    });

    test('gainPriority includes Estate when very few Provinces remain', () => {
      const agent = new Bureaucrat();
      const state = new State();

      state.setUp([agent, agent], muteConfig);
      state.countInSupply = () => 2; // Very few Provinces remain

      const priority = agent.gainPriority(state, state.current);

      expect(priority).toContain(cards.Estate);
    });

    test('gainPriority wants Duchy after Gold with 6 Provinces remaining', () => {
      const agent = new Bureaucrat();
      const state = new State();

      state.setUp([agent, agent], muteConfig);
      state.countInSupply = () => 6;

      const priority = agent.gainPriority(state, state.current);

      expect(priority).toContain(cards.Duchy);
      expect(priority).toContain(cards.Gold);
      expect(priority.indexOf(cards.Gold)).toBeLessThan(priority.indexOf(cards.Duchy));
    });

    test('gainPriority does not want Bureaucrat with low treasure density', () => {
      const agent = new Bureaucrat();
      const state = new State();

      state.setUp([agent, agent], muteConfig);
      state.current.countInDeck = () => 1;
      agent.countCardTypeInDeck = () => 19;

      const priority = agent.gainPriority(state, state.current);

      expect(priority).not.toContain(cards.Bureaucrat);
    });

    test('gainPriority wants Bureaucrat when has none', () => {
      const agent = new Bureaucrat();
      const state = new State();

      state.setUp([agent, agent], muteConfig);
      state.current.countInDeck = () => 0;
      agent.countCardTypeInDeck = () => 0;

      const priority = agent.gainPriority(state, state.current);

      expect(priority).toContain(cards.Bureaucrat);
    });
  });
});
