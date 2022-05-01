/**
 * This is taken from DomCardName
 *
 * Original constructor looks like:
 *   DomCardName(int aCoinCost, int aPotionCost, int aCoinValue, int aVictoryValue, int aPlayPriority, int aDiscardPriority, DomCardType[] aTypes)
 */
const heuristics = {
  // Base Cards
  Curse: {discardPriority: 10},
  Copper: {discardPriority: 15, playPriority: 55},
  Silver: {discardPriority: 20, playPriority: 25},
  Gold: {discardPriority: 24, playPriority: 30},
  Estate: {discardPriority: 9},
  Duchy: { discardPriority: 8 },
  Province: { discardPriority: 7, trashPriority: 60 },

  // Base Set
  Artisan: { types: [ 'Terminal' ], discardPriority: 27, playPriority: 30 },
  Bandit: { types: [ 'Terminal' ], discardPriority: 23, playPriority: 23 },
  Bureaucrat: { types: [ 'Terminal' ], discardPriority: 20, playPriority: 29 },
  Cellar: {types: ['Cycler'], discardPriority: 17, playPriority: 16},
  Chapel: { types: [ 'Terminal' ], discardPriority: 18, playPriority: 37 },
  'Council Room': { types: [ 'Terminal' ], discardPriority: 27, playPriority: 25 },
  Festival: {discardPriority: 26, playPriority: 3},
  Gardens: {discardPriority: 9},
  Harbinger: {types: ['Cycler'], discardPriority: 16, playPriority: 5},
  Laboratory: {types: ['Cycler', 'Card_Advantage'], discardPriority: 40, playPriority: 8},
  Library: { types: [ 'Terminal' ], discardPriority: 30, playPriority: 20 },
  Market: {types: ['Cycler'], discardPriority: 30, playPriority: 13},
  Merchant: {types: ['Cycler'], discardPriority: 19, playPriority: 7},
  Militia: { types: [ 'Terminal' ], discardPriority: 25, playPriority: 30 },
  Mine: { types: [ 'Terminal' ], discardPriority: 22, playPriority: 24 },
  Moat: { types: [ 'Terminal' ], discardPriority: 23, playPriority: 33 },
  Moneylender: { types: [ 'Terminal' ], discardPriority: 21, playPriority: 23 },
  Poacher: {types: ['Cycler'], discardPriority: 30, playPriority: 10},
  Remodel: { types: [ 'Terminal' ], discardPriority: 18, playPriority: 24 },
  Sentry: { types: ['Cycler'], discardPriority: 22, playPriority: 2 },
  Smithy: { types: [ 'Terminal' ], discardPriority: 24, playPriority: 25 },
  'Throne Room': { discardPriority: 22, playPriority: 7 },
  Vassal: { types: [ 'Terminal' ], discardPriority: 23, playPriority: 25 },
  Village: {types: ['Cycler', 'Village'], discardPriority: 21, playPriority: 5},
  Witch: { types: [ 'Terminal' ], discardPriority: 40, playPriority: 18 },
  Workshop: { types: [ 'Terminal' ], discardPriority: 22, playPriority: 38 },

  // Intrigue
  Baron: { types: [ 'Terminal' ], discardPriority: 25, playPriority: 22 },
  'Mining Village': { types: [ 'Village', 'Cycler' ], playPriority: 9, discardPriority: 22 }
};

export default heuristics;