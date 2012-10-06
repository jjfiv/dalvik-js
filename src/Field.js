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

// parses a string into a Field object
//
// for example: "Ljava/lang/System;.out:Ljava/io/PrintStream;"
//
// { name: "out", type: "Ljava/io/PrintStream;", definingClass: "Ljava/langSystem;" }
//
var FieldFromString = function(_string) {
  var _splitAtDots = _string.split('.')
  var _nextSplit = _splitAtDots[1].split(':')
  
  var _className = _splitAtDots[0]
  var _fieldName = _nextSplit[0]
  var _fieldType = _nextSplit[1]

  return new Field(_fieldName, _fieldType, _className)
}

