'use strict'

// This file contains a definition of a method

var Method = function(_name, _definingClass, _paramTypes, _returnType) {

  // the name of this method, used for dispatch & debugging
  this.name = _name

  // the name of the class that defines this method
  this.definingClass = _definingClass

  this.paramTypes = _paramTypes
  this.returnType = _returnType
  
  // the number of registers allocated by this method
  this.numRegisters = 0

  // the interpreter-specific code
  this.icode = []

}

Method.prototype.numParameters = function() {
  return this.paramTypes.length
}


