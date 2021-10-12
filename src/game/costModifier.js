export default class CostModifier {
  /**
   * This represents a cost modifier, which takes a callback modifier function.
   * It also requires a source specifying the card causing the modification.
   *
   * @param {CostModifier~modifierCallback} modifier
   * @param {Card} source
   */
  constructor (modifier, source) {
    this.source = source;
    this.modifier = modifier;
  }

  /**
   * Return de cost modifier applied to a card.
   *
   * @param {Card} card
   * @return {Number}
   */
  modify (card) {
    return this.modifier(card);
  }
}

/**
 * @callback CostModifier~modifierCallback
 * @param {Card}
 * @return {int}
 */
