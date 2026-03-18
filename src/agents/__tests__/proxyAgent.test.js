import ProxyAgent from '../proxyAgent';
import BasicAI from '../basicAI';
import SillyAI from '../dominiate/sillyAI';
import State from '../../game/state';

describe('ProxyAgent', () => {
  describe('with getActualAgent', () => {
    it('defaults to BasicAI if no agent was set', () => {
      const proxyAgent = new ProxyAgent();
      expect(proxyAgent.getActualAgent()).toBeInstanceOf(BasicAI);
      expect(proxyAgent.getActualAgent().toString()).toBe('BasicAI');
    });

    it('honors selected agent', () => {
      const proxyAgent = new ProxyAgent();
      const actualAgent = new SillyAI();

      proxyAgent.setActualAgent(actualAgent);
      expect(proxyAgent.getActualAgent()).toBe(actualAgent);
    });
  });

  describe('with setActualAgent', () => {
    it('hacks the agent to keep track of the player', () => {
      const proxyAgent = new ProxyAgent();
      const actualAgent = new SillyAI();
      const rivalAgent = new BasicAI();
      const state = new State();

      proxyAgent.setActualAgent(actualAgent);
      state.setUp([proxyAgent, rivalAgent], { log: () => {} });

      expect(actualAgent.myPlayer(state)).toBe(proxyAgent.myPlayer(state));
    });
  });

  describe('with copy', () => {
    it('assigns a copy of the current actual agent', () => {
      const proxyAgent = new ProxyAgent();
      const actualAgent = new SillyAI();

      proxyAgent.setActualAgent(actualAgent);

      /** @var {ProxyAgent} */
      const copy = proxyAgent.copy();

      expect(copy.actualAgent).not.toBe(actualAgent);
      expect(copy.actualAgent).toBeInstanceOf(SillyAI);
    });
  });

  describe('with choose', () => {
    it('defers the choice to the actual agent', () => {
      const proxyAgent = new ProxyAgent();
      const actualAgent = new SillyAI();
      const state = new State();

      actualAgent.choose = jest.fn();
      jest.spyOn(actualAgent, 'choose');

      proxyAgent.setActualAgent(actualAgent);

      /** @var {ProxyAgent} */
      proxyAgent.choose('FAKE_CHOICE', state, ['CHOICE_1', 'CHOICE_2']);

      expect(actualAgent.choose).toHaveBeenCalledWith('FAKE_CHOICE', state, ['CHOICE_1', 'CHOICE_2']);
    });
  });
});
