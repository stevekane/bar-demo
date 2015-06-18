'use strict'

module.exports = ActionState

function onEnter (blackJack) {
  console.log('entered action')  
}

function onExit (blackJack) {
  console.log('exited action')  
}

function update (dT, blackJack) {
  console.log('action update')  
}

function render (blackJack) {
  console.log('action render') 
}


