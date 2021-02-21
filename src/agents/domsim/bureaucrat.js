import { DomPlayer } from './domPlayer';
import cards from '../../game/cards';

export default class Bureaucrat extends DomPlayer {
  constructor () {
    super();
    this.requires = [cards.Bureaucrat];
  }

  gainPriority (state, my) {
    const priority = [];

    if (my.countInDeck(cards.Gold) > 0) {
      priority.push(cards.Province);
    }

    if (state.countInSupply(cards.Province) <= 5) {
      priority.push(cards.Duchy);
    }

    if (state.countInSupply(cards.Province) <= 2) {
      priority.push(cards.Estate);
    }

    priority.push(cards.Gold);

    if (state.countInSupply(cards.Province) <= 6) {
      priority.push(cards.Duchy);
    }

    if (my.countInDeck(cards.Bureaucrat) === 0) {
      priority.push(cards.Bureaucrat);
    }

    if (my.countInDeck(cards.Bureaucrat) < this.countCardTypeInDeck(my, 'Treasure') / 20) {
      priority.push(cards.Bureaucrat);
    }

    priority.push(cards.Silver);

    return priority;
  }
}
