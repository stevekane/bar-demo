module.exports.log = log
module.exports.pp = pp

function log (val) {
  console.log(val)
}

function ppObject (val) {
  console.log(val.constructor.name + ' ' + JSON.stringify(val, null, 2))
}

function pp (val) {
  if (val instanceof Object) ppObject(val)
  else                       log(val)

}
