// Field definitions
//
// Field objects can either be private or public, static or instance
//
// Dependencies: Type.js 

var Field = function(_name, _type, _definingClass) {
  this.name = _name; //string
  this.type = _type;
  this.definingClass = _definingClass; //type

  // these are defined separately from first three pieces of data
  this.accessFlags = 0;
};

Field.prototype.clone = function() {
  return new Field(this.name, this.type.clone(), this.definingClass.clone(), this.accessFlags);
};


//
// toStr method to build a string of the form
// Class.fieldName:typeStr
//
Field.prototype.toStr = function() {
  return this.definingClass + "." + this.name + ":" + this.type.toStr();
};

// parses a string into a Field object
//
// for example: "Ljava/lang/System;.out:Ljava/io/PrintStream;"
//
// { name: "out", type: "Ljava/io/PrintStream;", definingClass: "Ljava/langSystem;" }
//
var FieldFromString = function(_string) {
  var _splitAtDots = _string.split('.');
  var _nextSplit = _splitAtDots[1].split(':');
  
  var _className = new Type(_splitAtDots[0]);
  var _fieldName = _nextSplit[0];
  var _fieldType = new Type(_nextSplit[1]);

  return new Field(_fieldName, _fieldType, _className);
};

