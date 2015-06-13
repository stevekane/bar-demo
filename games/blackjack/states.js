'use strict'

var State = require('./State')
var Player = require('./Player')
var transactions = require('./transactions')
var dealRound = transactions.dealRound
var collectRound = transactions.collectRound

module.exports.BetCollecting = BetCollecting
module.exports.CardDealing = CardDealing
module.exports.Action = Action
module.exports.PostRound = PostRound
module.exports.CardCollecting = CardCollecting

var BET_DURATION = 1000
var DEAL_DURATION = 2000
var ACTION_DURATION = 5000
var POST_DURATION = 3000
var COLLECTION_DURATION = 2000

function BetCollecting (engine, game) {
  State.Timed.call(this, engine, game, 'Collecting Bets', BET_DURATION)

  this.enter = function () {
    this.duration = BET_DURATION
  }
}

function CardDealing (engine, game) {
  State.Timed.call(this, engine, game, 'Dealing Cards', DEAL_DURATION)

  this.enter = function () {
    this.duration = DEAL_DURATION
    dealRound(this.game.shoe, this.game.players, this.game.dealer)
  }
}

function Action (engine, game) {
  State.Timed.call(this, engine, game, 'Taking Action', ACTION_DURATION)

  this.update = function (dT) {
    if (this.duration <= 0) return this.game.stateManager.next()

    var player, key
      
    for (var i = 0; i < this.game.players.length; i++) {
      player = this.game.players[i]
        for (var j = 0; j < player.user.inputQueue.length; j++) {
          if (key === 'H') console.log('an h!')
        }
      player.user.inputQueue.splice(0)
    }
    this.duration -= dT
  }
}

function PostRound (engine, game) {
  State.Timed.call(this, engine, game, 'Finishing Round', POST_DURATION)
}

function CardCollecting (engine, game) {
  State.Timed.call(this, engine, game, 'Collecting Cards', COLLECTION_DURATION)

  this.enter = function () {
    this.duration = COLLECTION_DURATION
    collectRound(this.game.shoe, this.game.players, this.game.dealer)
  }
}
