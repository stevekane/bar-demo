'use strict'

export function instanceOf (Ctor) {
  return function innerInstanceOf (obj) {
    return obj instanceof Ctor 
  }
}
