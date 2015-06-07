module.exports = EventLogger

function EventLogger (maxSize) {
  var events = []

  function record (event) {
    if (events.length > maxSize) events.pop()
    events.unshift(event) 
  }

  function get () {
    return events 
  }
  this.record = record
  this.get = get
}

