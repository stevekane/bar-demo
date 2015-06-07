'use strict'

module.exports.pluck = pluck
module.exports.addLists = addLists
module.exports.shuffle = shuffle

function pluck (attrName) {
  return function innerPluck (obj) {
    return obj[attrName] 
  }
}

function addLists (list1, list2) {
  var results = []

  for (var i = 0; i < list1.length; i++) {
    for (var j = 0; j < list2.length; j++) {
      results.push(list1[i] + list2[j]) 
    } 
  }
  return results
}

function shuffle (o) {
  for(var j, x, i = o.length; 
      i; 
      j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o; 
}

