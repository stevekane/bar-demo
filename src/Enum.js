'use strict'

export default function Enum (...args) {
  for (var i = 0; i < args.length; i++) this[args[i]] = i
  Object.freeze(this)
}
