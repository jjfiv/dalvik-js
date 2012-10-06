// Field definitions
//
// Field objects can either be private or public, static or instance
//

var Field = function(_name, _type, _definingClass) {
  this.name = _name
  this.type = _type
  this.definingClass = _definingClass

  // these are defined separately from first three pieces of data
  this.accessFlags = 0
}

