import Village from './village.js';

export default class MiningVillage extends Village {
  constructor () {
    super();
    this.name = 'Mining Village';
    this.cost = 4;
  }

  /**
   * You may trash this for +$2
   *
   * @param {State} state
   */
  playEffect (state) {
    /**
     * Dominiate
     if state.current.ai.choose('miningVillageTrash', state, [yes, no])
       if state.current.playLocation != 'trash'
         transferCard(c['Mining Village'], state.current[state.current.playLocation], state.trash)
         state.current.playLocation = 'trash'
         state.log("...trashing the Mining Village for +$2.")
         state.current.coins += 2
     */

    /**
     * Dominion sim
    public void play() {
      owner.addActions(2);
      owner.drawCards(1);
      if (!owner.getCurrentGame().getBoard().getTrashedCards().contains(this))
        posibblyTrashThis();
    }

    private final void posibblyTrashThis() {
      if (owner.isHumanOrPossessedByHuman()) {
        handleHuman();
        return;
      }
      if (owner.getPlayStrategyFor(this)==DomPlayStrategy.forEngines && owner.getCurrentGame().getGainsNeededToEndGame()>3)
        return;
      if (owner.addingThisIncreasesBuyingPower( new DomCost( 2,0 )) || owner.getCurrentGame().getGainsNeededToEndGame()<=3) {
        DomPlayer theOwner = owner;
        owner.trash(owner.removeCardFromPlay( this ));
        //owner has now become null... so we use theOwner
        theOwner.addAvailableCoins( 2 );
      }
    }
     */
  }
}
