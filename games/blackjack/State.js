'use strict'

module.exports = State

function State (engine, game, name) {
  this.name = name
  this.engine = engine
  this.game = game
  this.enter = function () {}
  this.exit = function () {}
  this.update = function (dT) {}
  this.render = function () {}
}

State.Timed = function (engine, game, name, duration) {
  State.call(this, engine, game, name)
  this.duration = duration 

  this.update = function (dT) {
    if (this.duration <= 0) return this.game.stateManager.next()
    this.duration -= dT
  }

  this.enter = function () {
    this.duration = duration 
  }

  this.exit = function () {
    this.duration = 0 
  }
}
