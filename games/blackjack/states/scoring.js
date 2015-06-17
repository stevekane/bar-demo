'use strict'

module.exports.onEnter = onEnter
module.exports.onExit = onExit
module.exports.update = update
module.exports.render = render

function onEnter (blackJack) {
  console.log('entered scoring')  
}

function onExit (blackJack) {
  console.log('exited scoring')  
}

function update (dT, blackJack) {
  console.log('scoring update')  
}

function render (blackJack) {
  console.log('scoring render') 
}
