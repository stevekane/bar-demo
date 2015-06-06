var prettyLog = require('./index')
var log = prettyLog.log
var pp = prettyLog.pp

var sampleObject = {
  age: 5,
  stats: {
    weight: 5,
    height: 10
  },
  name: 'Boris'
}

function User (name, age) {
  this.name = name
  this.age = age
}

log(sampleObject)
pp(sampleObject)
pp(5)
pp('steven')
pp(new User(5, 'Daniel'))
