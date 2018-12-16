import BasicAI from '../../agents/basicAI';
import State from '../../game/state';
import Village from '../village';
import Workshop from '../workshop';

test('Workshop card definition', () => {
  const card = new Workshop();

  expect(card.cost).toBe(3);
});

test('Play effect allows gain', () => {
  const card = new Workshop();
  const state = new State();
  const basicAI = new BasicAI();
  const gainedCard = new Village();

  state.setUp([basicAI, basicAI], { log: () => {}, warn: () => {} });
  state.kingdom = { 'Village': 10 };
  state.gainOneOf = jest.fn(() => gainedCard);
  card.playEffect(state);

  expect(state.gainOneOf).toHaveBeenCalledWith(state.current, [gainedCard]);
});

test('Filters out expensive cards', () => {
  const card = new Workshop();
  const state = new State();
  const basicAI = new BasicAI();
  const gainedCard = new Village();

  state.setUp([basicAI, basicAI], { log: () => {}, warn: () => {} });
  state.kingdom = { 'Province': 8, 'Village': 10 };
  state.gainOneOf = jest.fn(() => {});
  card.playEffect(state);

  expect(state.gainOneOf).toHaveBeenCalledWith(state.current, [gainedCard]);
});

test('Does nothing if there are no valid cards to gain', () => {
  const card = new Workshop();
  const state = new State();
  const basicAI = new BasicAI();

  state.setUp([basicAI, basicAI], { log: () => {}, warn: () => {} });
  state.kingdom = { 'Province': 8 };
  state.gainOneOf = jest.fn(() => {});
  card.playEffect(state);

  expect(state.gainOneOf).toHaveBeenCalledWith(state.current, []);
});
