import ProxyAgent from '../proxyAgent';
import BasicAI from '../basicAI';
import SillyAI from '../dominiate/sillyAI';
import State from '../../game/state';

test('getActualAgent defaults to BasicAI if no aget was set', () => {
  const proxyAgent = new ProxyAgent();
  expect(proxyAgent.getActualAgent()).toBeInstanceOf(BasicAI);
  expect(proxyAgent.getActualAgent().toString()).toBe('BasicAI');
});

test('getActualAgent honors selected agent', () => {
  const proxyAgent = new ProxyAgent();
  const actualAgent = new SillyAI();

  proxyAgent.setActualAgent(actualAgent);
  expect(proxyAgent.getActualAgent()).toBe(actualAgent);
});

test('setActualAgent hacks the agent to keep track of the player', () => {
  const proxyAgent = new ProxyAgent();
  const actualAgent = new SillyAI();
  const rivalAgent = new BasicAI();
  const state = new State();

  proxyAgent.setActualAgent(actualAgent);
  state.setUp([proxyAgent, rivalAgent], { log: () => {} });

  expect(actualAgent.myPlayer(state)).toBe(proxyAgent.myPlayer(state));
});

test('Copy assigns a copy of the current actual agent', () => {
  const proxyAgent = new ProxyAgent();
  const actualAgent = new SillyAI();

  proxyAgent.setActualAgent(actualAgent);

  /** @var {ProxyAgent} */
  const copy = proxyAgent.copy();

  expect(copy.actualAgent).not.toBe(actualAgent);
  expect(copy.actualAgent).toBeInstanceOf(SillyAI);
});
