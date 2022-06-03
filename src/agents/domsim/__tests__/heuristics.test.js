import {
  DomPlayer, STRATEGY_AGGRESSIVE_TRASHING,
  STRATEGY_STANDARD,
  STRATEGY_TRASH_WHEN_OBSOLETE
} from '../domPlayer';
import State from '../../../game/state';
import cards from '../../../game/cards';
import heuristics from '../heuristics';
import BasicAction from '../../../cards/basicAction';

const muteConfig = {
  log: () => {
  },
  warn: () => {
  }
};

test('Prefer discard Monelender with no coppers on hand', () => {
  const ai = new DomPlayer();
  const state = new State();
  const card = cards.Moneylender;

  state.setUp([ai, ai], {
    log: () => {
    },
    warn: () => {
    }
  });
  state.current.hand = [card];

  expect(heuristics[card].calculatedDiscardPriority(state, card, state.current)).toBe(16);
});

test('Moneylender skips calculated discard priority with coppers on hand', () => {
  const ai = new DomPlayer();
  const state = new State();
  const card = cards.Moneylender;

  state.setUp([ai, ai], {
    log: () => {
    },
    warn: () => {
    }
  });
  state.current.hand = [card, cards.Copper];

  expect(heuristics[card].calculatedDiscardPriority(state, card, state.current)).toBe(false);
});

test('Prefer discard Throne Room with no actions to copy', () => {
  const ai = new DomPlayer();
  const state = new State();
  const card = cards['Throne Room'];

  state.setUp([ai, ai], {
    log: () => {
    },
    warn: () => {
    }
  });
  state.current.hand = [card];

  expect(heuristics[card].calculatedDiscardPriority(state, card, state.current)).toBe(15);
});

test('Throne Room skips calculated discard priority with other actions on hand', () => {
  const ai = new DomPlayer();
  const state = new State();
  const card = cards['Throne Room'];

  state.setUp([ai, ai], {
    log: () => {
    },
    warn: () => {
    }
  });
  state.current.hand = [card, cards.Smithy];

  expect(heuristics[card].calculatedDiscardPriority(state, card, state.current)).toBe(false);
});

test('Witch calculated discard priority is treated as Moat\'s if no curses left', () => {
  const ai = new DomPlayer();
  const state = new State();
  const card = cards.Witch;
  let moatDiscardValue;

  state.setUp([ai, ai], {
    log: () => {
    },
    warn: () => {
    }
  });
  state.kingdom.Curse = 0;
  moatDiscardValue = ai.discardValue(state, cards.Moat, state.current);

  expect(heuristics[card].calculatedDiscardPriority(state, card, state.current)).toBe(moatDiscardValue);
});

test('Witch skips calculated discard priority with curses in supply', () => {
  const ai = new DomPlayer();
  const state = new State();
  const card = cards.Witch;

  state.setUp([ai, ai], {
    log: () => {
    },
    warn: () => {
    }
  });
  expect(heuristics[card].calculatedDiscardPriority(state, card, state.current)).toBe(false);
});

test('Moneylender trashValue is slightly less than Curse\'s without coppers in deck.', () => {
  const ai = new DomPlayer();
  const state = new State();
  const card = cards.Moneylender;
  const originalCurseValue = heuristics[cards.Curse].trashPriority;

  state.setUp([ai, ai], {
    log: () => {
    },
    warn: () => {
    }
  });
  state.current.hand = [card];
  state.current.discard = [];
  state.current.draw = [];
  heuristics[cards.Curse].trashPriority = 6;

  expect(heuristics[card].calculatedTrashPriority(state, card, state.current)).toBe(9);
  heuristics[cards.Curse].trashPriority = originalCurseValue;
});

test('Moneylender calculated trash priority is skipped with Coppers in deck', () => {
  const ai = new DomPlayer();
  const state = new State();
  const card = cards.Moneylender;

  state.setUp([ai, ai], {
    log: () => {
    },
    warn: () => {
    }
  });
  state.current.hand = [card];
  state.current.discard = [cards.Copper];
  state.current.draw = [];

  expect(heuristics[card].calculatedTrashPriority(state, card, state.current))
    .toBe(false);
});

test('Silver calculated trash priority with high action count', () => {
  const ai = new DomPlayer();
  const state = new State();
  const action = new BasicAction();

  state.setUp([ai, ai], {
    log: () => {
    },
    warn: () => {
    }
  });
  ai.playStrategies[cards.Silver] = STRATEGY_TRASH_WHEN_OBSOLETE;
  state.current.draw = [
    action, action, action, action, action,
    action, action, action, action, action
  ];

  expect(heuristics[cards.Silver].calculatedTrashPriority(state, cards.Silver, state.current))
    .toBe(1);
});

test('Silver calculated trash priority with high action count', () => {
  const ai = new DomPlayer();
  const state = new State();

  state.setUp([ai, ai], {
    log: () => {
    },
    warn: () => {
    }
  });
  ai.playStrategies[cards.Silver] = STRATEGY_TRASH_WHEN_OBSOLETE;
  state.current.draw = [cards.Silver, cards.Silver, cards.Silver, cards.Silver];

  expect(heuristics[cards.Silver].calculatedTrashPriority(state, cards.Silver, state.current))
    .toBe(1);
});

test('Silver calculated trash priority is skipped without specific strategy agent', () => {
  const ai = new DomPlayer();
  const state = new State();

  state.setUp([ai, ai], {
    log: () => {
    },
    warn: () => {
    }
  });
  ai.playStrategies[cards.Silver] = STRATEGY_STANDARD;

  expect(heuristics[cards.Silver].calculatedTrashPriority(state, cards.Silver, state.current))
    .toBe(false);
});

test('Gardens calculated trash priority when agent wants gardens', () => {
  const ai = new DomPlayer();
  const state = new State();

  state.setUp([ai, ai], {
    log: () => {
    },
    warn: () => {
    }
  });
  ai.wantsToGainOrKeep = () => true;

  expect(heuristics[cards.Gardens].calculatedTrashPriority(state, cards.Gardens, state.current))
    .toBe(-49);
});

test('Gardens calculated trash priority ignores when agent does not want gardens', () => {
  const ai = new DomPlayer();
  const state = new State();

  state.setUp([ai, ai], {
    log: () => {
    },
    warn: () => {
    }
  });
  ai.wantsToGainOrKeep = () => false;

  expect(heuristics[cards.Gardens].calculatedTrashPriority(state, cards.Gardens, state.current))
    .toBe(false);
});

test('Duchy calculated trash priority when agent wants Duchies', () => {
  const ai = new DomPlayer();
  const state = new State();

  state.setUp([ai, ai], {
    log: () => {
    },
    warn: () => {
    }
  });
  ai.wantsToGainOrKeep = () => true;

  expect(heuristics[cards.Duchy].calculatedTrashPriority(state, cards.Duchy, state.current))
    .toBe(-24);
});

test('Duchy calculated trash priority ignores when agent does not want Duchies', () => {
  const ai = new DomPlayer();
  const state = new State();

  state.setUp([ai, ai], {
    log: () => {
    },
    warn: () => {
    }
  });
  ai.wantsToGainOrKeep = () => false;

  expect(heuristics[cards.Duchy].calculatedTrashPriority(state, cards.Duchy, state.current))
    .toBe(false);
});

test('Estate calculated trash priority when agent wants Estates', () => {
  const ai = new DomPlayer();
  const state = new State();

  state.setUp([ai, ai], {
    log: () => {
    },
    warn: () => {
    }
  });
  ai.wantsToGainOrKeep = () => true;

  expect(heuristics[cards.Estate].calculatedTrashPriority(state, cards.Estate, state.current))
    .toBe(-19);
});

test('Estate calculated trash priority ignores when agent does not want Estates', () => {
  const ai = new DomPlayer();
  const state = new State();

  state.setUp([ai, ai], muteConfig);
  ai.wantsToGainOrKeep = () => false;

  expect(heuristics[cards.Estate].calculatedTrashPriority(state, cards.Estate, state.current))
    .toBe(false);
});

test('Chapel does not want to be played with empty hand', () => {
  const ai = new DomPlayer();
  const state = new State();

  state.setUp([ai, ai], muteConfig);
  state.current.hand = [];

  expect(heuristics[cards.Chapel].wantsToBePlayed(state, state.current)).toBe(false);
});

it.each(
  [
    [2, -1, true, STRATEGY_AGGRESSIVE_TRASHING, 5, 2, false],
    [2, 1, true, STRATEGY_AGGRESSIVE_TRASHING, 5, 2, false],
    [2, 1, false, STRATEGY_AGGRESSIVE_TRASHING, 5, 2, false],
    [2, 1, false, STRATEGY_AGGRESSIVE_TRASHING, 5, 0, true],
    [4, 1, true, STRATEGY_AGGRESSIVE_TRASHING, 5, 0, true],
    [2, 1, false, STRATEGY_AGGRESSIVE_TRASHING, 3, 0, true]
  ]
)(
  'Chapel wantsToBePlayed #%#',
  (
    cardsInHand,
    trashValue,
    loseMoney, strategy,
    totalMoney,
    potentialCoin,
    expected
  ) => {
    const ai = new DomPlayer();
    const state = new State();

    state.setUp([ai, ai], muteConfig);

    // Has cards in hand
    state.current.hand = Array(cardsInHand).fill(cards.Estate);
    // Cards have trash value (1st condition)
    ai.trashValue = () => trashValue;
    // Trashing would lose money (2nd condition)
    ai.removingReducesBuyingPower = () => loseMoney;
    // Aggressive trash strategy (2 cards < threshold=3, 3rd condition)
    ai.playStrategies[cards.Chapel] = strategy;
    // Total money would go below threshold (5 - 2 = 3 < 4, 4th condition)
    // Total money is over min money threshold (5th condition)
    ai.getTotalMoney = () => totalMoney;
    ai.getPotentialCoinValue = () => potentialCoin;

    ai.choose = () => cards.Estate;
    expect(heuristics[cards.Chapel].wantsToBePlayed(state, state.current)).toBe(expected);
  }
);
