'use strict'

export function assert (fn, ...rest) {
  if (!fn(...rest)) throw new Error("Assertion Failed")
}

export function ofType (Ctor, val) {
  if (!(val instanceof Ctor)) throw new Error(text)
}
