'use strict'

function BetCollecting (players, startTime, duration) {
  this.players = players
  this.startTime = startTime
  this.duration = duration
  this.done = this.duration <= 0
}

BetCollecting.prototype.update = function (dT) {
  this.done = this.duration <= 0
  this.duration -= dT 
}

function CardDealing () {
  //wait duration
}

function PostDealing () {
  //handle dealt blackjacks
  //allow players to split their hand into two hands
  //allow players to doubledown their bet
  //if all players are done with postDeal move on
  //wait duration default for players is postDeal is done
}

function Action () {
  //allow all players to hit or stand
  //stand ends betting phase for player
  //bust ends betting phase for player
  //wait duration default for players is to stand
}

function PostRound () {
  //calculate and distribute winnings
  //collect bets from losers
  //wait duration
}
