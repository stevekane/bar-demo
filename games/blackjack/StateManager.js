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

StateManager.prototype.next = function () {
  var currentIndex = this.states.indexOf(this.activeState)

  this.activeState.exit()
  this.activeState = this.states[currentIndex + 1] || 
                     this.states[0]
  this.activeState.enter()
}

StateManager.prototype.previous = function () {
  var currentIndex = this.states.indexOf(this.activeState)
  
  this.activeState.exit()
  this.activeState = this.states[currentIndex - 1] || 
                     this.states[this.states.length - 1]
  this.activeState.enter()
}
