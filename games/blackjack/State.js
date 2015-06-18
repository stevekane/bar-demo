'use strict'

module.exports = State

function State (duration) {
  this.duration = duration
}

State.prototype.onEnter = function (game) {}
State.prototype.onExit = function (game) {}
State.prototype.update = function (dT, game) {}
State.prototype.render = function (game) {}
