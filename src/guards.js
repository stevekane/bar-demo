'use strict'

export function assert (fn, ...rest) {
  let text = "Assertion failed"

  if (!fn(...rest)) {
    throw new Error(text)
  }
}

export function ofType (Ctor, val) {
  let text = "Not valid type"
  if (!(val instanceof Ctor)) {
    throw new Error(text)
  }
}
