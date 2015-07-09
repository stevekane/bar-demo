'use strict'

export function randRange (min, max) {
  return min + Math.floor(Math.random() * max - min)
}

export function within (min, max, val) {
  return val >= min && val <= max
}

export function sum (a, b) {
  return a + b
}
