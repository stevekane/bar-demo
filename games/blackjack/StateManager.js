'use strict'

module.exports = StateManager

/* StateManager contains a list of states all of which expose an
 * update function which in turn is called at the update rate for
 * the game.  This ensures that the statemanager is only invoking
 * the update function for one state at a time
 */
function StateManager (states) {
  this.activeState = states[0]
  this.states = states
}
