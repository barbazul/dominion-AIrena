import {DomPlayer} from './domPlayer.js';
import cards from '../../game/cards.js';

export default class BurningSkullHTBD1 extends DomPlayer {
  constructor() {
    super();
    this.name = 'Burning Skull HTBD#1';
    this.requires = [
      cards.Sentry, cards.Vassal, cards['Throne Room'], cards.Laboratory,
      cards.Militia, cards.Poacher, cards.Harbinger
    ];
  }

  gainPriority(state, my) {
    const priority = [];

    if (my.countInDeck(cards.Laboratory) > 0) {
      my.log(`I have ${my.countInDeck(cards.Laboratory)} Labs -> I want Province`);
      priority.push(cards.Province);
    }

    if (state.countInSupply(cards.Province) <= 4) {
      my.log(`There are ${state.countInSupply(cards.Province)} Provs left -> I want Duchy`);
      priority.push(cards.Duchy);
    }

    if (state.countInSupply(cards.Province) <= 2) {
      my.log(`There are ${state.countInSupply(cards.Province)} Provs left -> I want Estate`);
      priority.push(cards.Estate);
    }

    if (my.countInDeck(cards.Sentry) < 4) {
      my.log(`I have ${my.countInDeck(cards.Sentry)} Sentries -> I want Sentries`);
      priority.push(cards.Sentry);
    }

    if (this.getTotalMoney(my) < 8) {
      my.log(`I have ${this.getTotalMoney(my)} total moneys -> I want Gold`);
      priority.push(cards.Gold);
    }

    if (this.getTotalMoney(my) < 6) {
      my.log(`I have ${this.getTotalMoney(my)} total moneys -> I want Vassal`);
      priority.push(cards.Vassal);
    }

    if (my.countInDeck(cards.Sentry) > 1 &&
        my.countInDeck(cards['Throne Room']) < this.countCardTypeInDeck(my, 'Cycler') &&
        my.countInDeck(cards['Throne Room']) < 1) {
      my.log(`I have ${my.countInDeck(cards.Sentry)} Sentries, ${this.countCardTypeInDeck(my, 'Cycler')} cantrips and ${my.countInDeck(cards['Throne Room'])} Throne Rooms -> I want TRs`);
      priority.push(cards['Throne Room']);
    }

    my.log('I always wants more Labs');
    priority.push(cards.Laboratory);

    if (my.countInDeck(cards.Sentry) > 1 &&
        my.countInDeck(cards['Throne Room']) < this.countCardTypeInDeck(my, 'Cycler')) {
      my.log(`I have ${my.countInDeck(cards.Sentry)} Sentries, ${this.countCardTypeInDeck(my, 'Cycler')} cantrips and ${my.countInDeck(cards['Throne Room'])} Throne Rooms -> I want TRs`);
      priority.push(cards['Throne Room']);
    }

    if (my.countInDeck(cards.Militia) === 0) {
      my.log('No Militia -> I want Militia');
      priority.push(cards.Militia);
    }

    if (my.countInDeck(cards.Vassal) === 0) {
      my.log('No Vassal -> I want Vassal');
      priority.push(cards.Vassal);
    }

    my.log('I always wants more Poachers');
    priority.push(cards.Poacher);
    my.log('I always wants more Harbingers');
    priority.push(cards.Harbinger);

    return priority;
  }
}
