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

  // whether this method is defined within a dexFile; it may still be native if defined
  // this will be false if it is just referenced
  this.defined = false;

  // make default try information that won't match anything
  this.tryInfo = new TryRange(-1, -1);

  // the interpreter-specific code
  this.icode = [];
};

Method.prototype.isMain = function() {
  return this.signature.isMain();
};

Method.prototype.getName = function() {
  return this.signature.name;
};

Method.prototype.getReturnType = function() {
  return this.signature.getReturnType();
};

Method.prototype.getParameterAmount = function() {
  return this.signature.getReturnType();
};

Method.prototype.isNative = function() {
  return this.icode.length === 0;
  //TODO check access flags for synthetic
};


//
// toString method to build a string of the form
// Class.methodSignature
// Class.name(TA,TB)RT
//
Method.prototype.toString = function() {
  return this.definingClass.getTypeString() + "." + this.signature.toString();
};

Method.prototype.numParameters = function() {
  return this.signature.parameterTypes.length;
};
