import BasicAI from '../../agents/basicAI';
import cards from '../../game/cards';
import State from '../../game/state';
import Bureaucrat from '../bureaucrat';

test('Bureaucrat card definition', () => {
  const card = new Bureaucrat();

  expect(card.toString()).toBe('Bureaucrat');
  expect(card.cost).toBe(4);
});

test('playEffect gains a Silver on top of the deck', () => {
  const state = new State();
  const basicAI = new BasicAI();
  const card = new Bureaucrat();

  state.setUp([basicAI, basicAI], { log: () => {}, warn: () => {} });
  state.gainCard = jest.fn(() => {});
  card.playEffect(state);

  expect(state.gainCard).toHaveBeenCalledWith(state.current, cards.Silver, 'draw');
});

test('playEffect attacks opponents', () => {
  const state = new State();
  const basicAI = new BasicAI();
  const card = new Bureaucrat();

  state.setUp([basicAI, basicAI], { log: () => {}, warn: () => {} });
  state.attackOpponents = jest.fn(() => {});
  card.playEffect(state);

  expect(state.attackOpponents).toHaveBeenCalledWith(card.bureaucratAttack);
});

test('bureaucratAttack with no victory hands forces hand reveal', () => {
  const state = new State();
  const basicAI = new BasicAI();
  const card = new Bureaucrat();

  state.setUp([basicAI, basicAI], { log: () => {}, warn: () => {} });
  state.revealHand = jest.fn(() => {});
  state.current.hand = [cards.Silver, cards.Silver];
  card.bureaucratAttack(state.current, state);

  expect(state.revealHand).toHaveBeenCalledWith(state.current);
});

test('bureaucratAttack with single victory in hands forces topdeck', () => {
  const state = new State();
  const basicAI = new BasicAI();
  const card = new Bureaucrat();

  state.setUp([basicAI, basicAI], { log: () => {}, warn: () => {} });
  state.revealHand = jest.fn(() => {});
  state.current.hand = [cards.Estate, cards.Silver];
  state.current.draw = [];
  card.bureaucratAttack(state.current, state);

  expect(state.current.draw[0]).toBe(cards.Estate);
  expect(state.revealHand).not.toHaveBeenCalled();
});

test('bureaucratAttack with multiple victory cards makes opponent choose', () => {
  const state = new State();
  const basicAI = new BasicAI();
  const card = new Bureaucrat();

  state.setUp([basicAI, basicAI], { log: () => {}, warn: () => {} });
  state.revealHand = jest.fn(() => {});
  state.current.hand = [cards.Estate, cards.Silver, cards.Province];
  state.current.draw = [];
  basicAI.choose = jest.fn(() => cards.Province);
  card.bureaucratAttack(state.current, state);

  expect(basicAI.choose).toHaveBeenCalledWith('topdeck', state, [cards.Estate, cards.Province]);
  expect(state.current.draw[0]).toBe(cards.Province);
  expect(state.revealHand).not.toHaveBeenCalled();
});
