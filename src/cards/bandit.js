import BasicAI from '../agents/basicAI';
import cards from '../game/cards';
import BasicAttack from './basicAttack';

export default class Bandit extends BasicAttack {
  constructor () {
    super();
    this.cost = 5;
  }

  /**
   * Gain a Gold. Each other player reveals the top 2 cards of their deck,
   * trashes a revealed treasure other than Copper, and discards the rest.
   *
   * @param {State} state
   */
  playEffect (state) {
    state.gainCard(state.current, cards.Gold);
    state.attackOpponents(banditAttack);
  }
}

/**
 * @param {Player} opp
 * @param {State} state
 */
export function banditAttack (opp, state) {
  const topCards = opp.getCardsFromDeck(2);
  const treasures = [];
  const toDiscard = [];
  let toTrash;

  // Todo Reveal the cards (for Patron)
  opp.log(`${opp.agent} reveals ${topCards}.`);

  for (let card of topCards) {
    if (!card.isTreasure() || card === cards.Copper) {
      toDiscard.push(card);
      continue;
    }

    treasures.push(card);
  }

  // Found at least 1 treasure...
  if (treasures.length > 0) {
    toTrash = opp.agent.choose(BasicAI.CHOICE_TRASH, state, treasures);

    if (toTrash) {
      const discardedTreasures = treasures.slice();
      discardedTreasures.splice(treasures.indexOf(toTrash), 1);
      opp.log(`${opp.agent} trashes ${toTrash}.`);
      state.trash.push(toTrash);
      toDiscard.push(...discardedTreasures);
    }
  }

  // Todo Actually doDiscard the cards (might trigger stuff)
  opp.log(`${opp.agent} discards ${toDiscard}.`);
  opp.discard.unshift(...toDiscard);
}
