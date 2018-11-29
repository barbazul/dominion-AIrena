/**
 * This defines the base for an AI agent.
 * All AI agents should extend this.
 * It implements the base decision making machinery as well as several heuristic based decitions
 */
export default class BasicAI {
  constructor () {
    this.requires = [];
    this.name = this.constructor.name;
  }

  /**
   * Returns the Player state object associated to the AI making the choice.
   * state.current cannot be used since some decisions are made on other players turns
   *
   * @param state
   */
  myPlayer (state) {
    let found = -1;

    for (let i = 0; i < state.players.length; i++) {
      if (state.players[i].agent === this) {
        found = i;
        break;
      }
    }

    if (found < 0) {
      throw new Error(this.name + ' is being asked a decision but is not playing');
    }

    return state.players[found];
  }

  /**
   * This is the general case decision entry point.
   * For each type of decision there are up to 2 specific decision implementations.
   *
   * The first is a priority list, which returns the order in which to prefer the choices if available.
   * In this case, null represents explicitly 'no choice', when this is a legal option.
   *
   * The second one receives each individual choice and returns a numerical value for it. Null is only 0, so negative
   * values means 'avoid this choice, unless forced to'
   *
   * @param {String} type
   * @param {State} state
   * @param {Array} choices
   * @todo Replace choices array for some wrapper class which would contain logic regarding the structure of its choices
   * @todo Extract the whole *Func logic
   */
  choose (type, state, choices) {
    const my = this.myPlayer(state);
    const flatChoices = choices.map(choice => choice === null ? null : choice.toString());
    let priority;
    let priorityFunc;
    let bestChoice = null;
    let bestValue = -Infinity;

    // No real choice
    if (choices.length === 1) {
      return choices[0];
    }

    // When there are no choices we follow the rule that makes the null choice available in that situation.
    if (choices.length === 0) {
      return null;
    }

    // Check the priority list
    priorityFunc = this.getPriorityFunction(type);

    if (priorityFunc) {
      priority = priorityFunc.call(this, state, my);

      for (let i = 0; i < priority.length; i++) {
        const preference = priority[i];
        const index = flatChoices.indexOf(preference);

        if (index > -1) {
          return choices[index];
        }
      }
    }

    // The priority list does not want any of the choices (or there  is no priority list)
    // Evaluate each option to choose best
    for (let i = 0; i < choices.length; i++) {
      const value = this.getChoiceValue(type, state, choices[i], my);

      if (value > bestValue) {
        bestValue = value;
        bestChoice = choices[i];
      }
    }

    if (bestChoice !== null) {
      return bestChoice;
    }

    throw new Error(`${this.name} somehow failed to make a choice`);
  }

  /**
   * Get a priority list generator function for the type of decision if available
   *
   * @param {String} type
   * @returns {function(State, Player):String[]}
   */
  getPriorityFunction (type) {
    const priorityFunc = this[type + 'Priority'];

    if (priorityFunc) {
      return priorityFunc;
    }

    return null;
  }

  /**
   * Assigns a numerical value to a single choice
   *
   * @param {String} type
   * @param {State} state
   * @param {*} choice
   * @param {Player} my
   * @returns {number}
   */
  getChoiceValue (type, state, choice, my) {
    let specificFunction;

    if (choice === null) {
      return 0;
    }

    specificFunction = this.getValueFunction(type);

    if (specificFunction) {
      const result = specificFunction.call(this, state, choice, my);

      if (result !== null) {
        return result;
      }
    }

    // Skipping Dominiate default value function because I dont want to put hard heuristics in cards for now

    state.warn(`${this.name} doesn't know how to make a ${type} decision for ${choice}`);

    return -1000;
  }

  /**
   * Get a choice evaluator function for the type of decision if available
   *
   * @param {String} type
   * @return {Function}
   */
  getValueFunction (type) {
    const valueFunc = this[type + 'Value'];

    if (valueFunc) {
      return valueFunc;
    }

    return null;
  }

  /**
   * Heuristic discard priority .
   *
   * The default `discardPriority` is tuned for Big Money where the decisions
   * are obvious. But many strategies would probably prefer a different
   * priority list, especially one that knows about action cards.
   *
   * It doesn't understand
   * discarding cards to make Shanty Town or Menagerie work, for example.
   *
   * @param {State} state
   * @param {Player} my
   * @return {String[]} array
   */
  discardPriority (state, my) {
    return [
      'Tunnel',
      'Vineyard',
      'Colony',
      'Duke',
      'Duchy',
      'Fairgrounds',
      'Gardens',
      'Province',
      'Curse',
      'Estate'
    ];
  }

  /**
   * Heuristic discard value.
   *
   * Evaluates whether it has excess actions and prioritizes actions if so.
   * Otherwise discards the cheapest cards. Victory cards would already been
   * discarded by discardPriority unless customized.
   *
   * @param {State} state
   * @param {Card} card
   * @param {Player} my
   * @return {int}
   */
  discardValue (state, card, my) {
    if (card.isAction() && my.actions === 0) {
      return 20 - card.cost;
    }

    return 0 - card.cost;
  }
}

BasicAI.CHOICE_DISCARD = 'discard';
