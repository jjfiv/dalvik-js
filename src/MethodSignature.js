// This file deals with method signatures

'use strict';

var MethodSignature = function(name, returnType, parameterTypes) { 
  
  this._name = name;
  this._returnType = returnType.getType();
  this._parameterTypes = [];
  this._parameterAmount = parameterTypes.length();
  if (this._parameterAmount != 0) { // Assigning parameter array if there are any
    this._parameterTypes = parameterTypes;
  }
  
  
};

MethodSignature.prototype.getName = function() {
  return this._name;
};

MethodSignature.prototype.getReturnType = function() {
  return this._returnType;
};

MethodSignature.prototype.equals = function (other) {
  return this.toStr() === other.toStr();
};

MethodSignature.prototype.toStr = function () {
//print(TypeA,TypeB,TypeC)ReturnType
  var str;
  
  str = this.getName() + "(";
  if (this._parameterAmount > 0) {
  }
  
  str += ")" + this.getReturnType();
  
  return str;  
}

var methName = "testMeth";
var methRet = "[