'use strict'

module.exports.onEnter = onEnter
module.exports.onExit = onExit
module.exports.update = update
module.exports.render = render

function onEnter (blackJack) {
  console.log('entered betting')  
}

function onExit (blackJack) {
  console.log('exited betting')  
}

function update (dT, blackJack) {
  console.log('betting update')  
}

function render (blackJack) {
  console.log('betting render') 
}
