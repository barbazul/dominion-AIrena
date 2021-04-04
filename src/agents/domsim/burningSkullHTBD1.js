import { DomPlayer } from './domPlayer';

export default class BurningSkullHTBD1 extends DomPlayer {
  constructor () {
    super();
    this.name = 'Burning Skull HTBD#1';
    this.requires = ['Sentry', 'Vassal', 'Throne Room', 'Laboratory', 'Militia', 'Poacher', 'Harbinger'];
  }

  gainPriority (state, my) {
    const priority = [];

    if (my.countInDeck('Laboratory') > 0) {
      my.log(`I have ${my.countInDeck('Laboratory')} Labs -> I want Province`);
      priority.push('Province');
    }

    if (state.countInSupply('Province') <= 4) {
      my.log(`There are ${state.countInSupply('Province')} Provs left -> I want Duchy`);
      priority.push('Duchy');
    }

    if (state.countInSupply('Province') <= 2) {
      my.log(`There are ${state.countInSupply('Province')} Provs left -> I want Estate`);
      priority.push('Estate');
    }

    if (my.countInDeck('Sentry') < 4) {
      my.log(`I have ${my.countInDeck('Sentry')} Sentries -> I want Sentries`);
      priority.push('Sentry');
    }

    if (this.getTotalMoney(my) < 8) {
      my.log(`I have ${this.getTotalMoney(my)} total moneys -> I want Gold`);
      priority.push('Gold');
    }

    if (this.getTotalMoney(my) < 6) {
      my.log(`I have ${this.getTotalMoney(my)} total moneys -> I want Vassal`);
      priority.push('Vassal');
    }

    if (my.countInDeck('Sentry') > 1 &&
      my.countInDeck('Throne Room') < this.countCardTypeInDeck(my, 'Cycler') &&
      my.countInDeck('Throne Room') < 1) {
      my.log(`I have ${my.countInDeck('Sentry')} Sentries, ${this.countCardTypeInDeck(my, 'Cycler')} cantrips and ${my.countInDeck('Throne Room')} Throne Rooms -> I want TRs`);
      priority.push('Throne Room');
    }

    my.log('I always wants more Labs');
    priority.push('Laboratory');

    if (my.countInDeck('Sentry') > 1 &&
      my.countInDeck('Throne Room') < this.countCardTypeInDeck(my, 'Cycler')) {
      my.log(`I have ${my.countInDeck('Sentry')} Sentries, ${this.countCardTypeInDeck(my, 'Cycler')} cantrips and ${my.countInDeck('Throne Room')} Throne Rooms -> I want TRs`);
      priority.push('Throne Room');
    }

    if (my.countInDeck('Militia') === 0) {
      my.log('No Militia -> I want Militia');
      priority.push('Militia');
    }

    if (my.countInDeck('Vassal') === 0) {
      my.log('No Vassal -> I want Vassal');
      priority.push('Vassal');
    }

    my.log('I always wants more Poachers');
    priority.push('Poacher');
    my.log('I always wants more Harbingers');
    priority.push('Harbinger');

    return priority;
  }
}
