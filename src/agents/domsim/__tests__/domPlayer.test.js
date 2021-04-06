import { DomPlayer } from '../domPlayer';
import Player from '../../../game/player';
import BasicAction from '../../../cards/basicAction';
import cards from '../../../game/cards';

test('countTerminalsInDeck returns 0 with empty deck', () => {
  const ai = new DomPlayer();
  const owner = new Player(ai, () => {});

  owner.getDeck = () => [];
  expect(ai.countTerminalsInDeck(owner)).toBe(0);
});

test('countTerminalsInDeck counts deck full of terminals', () => {
  const ai = new DomPlayer();
  const owner = new Player(ai, () => {});

  owner.getDeck = () => [ new BasicAction(), new BasicAction() ];
  expect(ai.countTerminalsInDeck(owner)).toBe(2);
});

test('countTerminalsInDeck returns 0 with deck without actions', () => {
  const ai = new DomPlayer();
  const owner = new Player(ai, () => {});

  owner.getDeck = () => [ cards.Copper, cards.Copper ];
  expect(ai.countTerminalsInDeck(owner)).toBe(0);
});

test('countTerminalsInDeck ignores villages and cantrips', () => {
  const ai = new DomPlayer();
  const owner = new Player(ai, () => {});

  owner.getDeck = () => [ cards.Village, cards.Market, cards.Militia ];
  expect(ai.countTerminalsInDeck(owner)).toBe(1);
});
