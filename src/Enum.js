'use strict'

function Enum () {
  let args = Array.prototype.slice.call(arguments, 0)
  let i = -1

  while (++i < args.length) this[args[i]] = i
}

module.exports = Enum

