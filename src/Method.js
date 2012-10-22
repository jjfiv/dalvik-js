// This file contains a definition of a method
//
// Dependencies: MethodSignature.js
//

var Method = function (_name, _definingClass, _paramTypes, _returnType) {

  // the name of this method, used for dispatch & debugging
  this.signature = new MethodSignature(_name, _returnType, _paramTypes);

  // the name of the class that defines this method
  this.definingClass = _definingClass;

  // the number of registers allocated by this method
  this.numRegisters = 0;

  // permissions of this method
  this.accessFlags = 0;

  // the interpreter-specific code
  this.icode = [];
};

Method.prototype.getName = function() {
  return this.signature.getName();
};

Method.prototype.getReturnType = function() {
  return this.signature.getReturnType();
};

Method.prototype.getParameterAmount = function() {
  return this.signature.getReturnType();
};


//
// toStr method to build a string of the form
// Class.methodSignature
// Class.name(TA,TB)RT
//
Method.prototype.toStr = function() {
  return this.definingClass.toStr() + "." + this.signature.toStr();
};

Method.prototype.numParameters = function() {
  return this.paramTypes.length;
};


