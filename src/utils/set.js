'use strict'

import {remove} from './array'

export function add (array, obj) {
  if (array.indexOf(obj) === -1) array.push(obj)
}

export move (array1, array2, obj) {
  remove(array1, obj)
  add(array2, obj)
}
