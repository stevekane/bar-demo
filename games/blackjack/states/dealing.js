'use strict'

module.exports.onEnter = onEnter
module.exports.onExit = onExit
module.exports.update = update
module.exports.render = render

function onEnter (blackJack) {
  console.log('entered dealing')  
}

function onExit (blackJack) {
  console.log('exited dealing')  
}

function update (dT, blackJack) {
  console.log('dealing update')  
}

function render (blackJack) {
  console.log('dealing render') 
}
