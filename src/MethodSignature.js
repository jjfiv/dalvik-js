// This file deals with method signature
// Dependencies: Type.js

'use strict';

var MethodSignature = function(name, returnType, parameterTypes) { 
  var _i;  
  this._name = name;
  this._returnType = returnType;
  this._parameterTypes = [];
  this._parameterAmount = parameterTypes.length;
  if (this._parameterAmount != 0) { // Assigning parameter array if there are any
    for (_i = 0; _i < this._parameterAmount; _i++) {
      this._parameterTypes.push(parameterTypes[_i]);
    }
  }
};

MethodSignature.prototype.isMain = function(){
  return this._name==='main';
};

MethodSignature.prototype.getName = function() {
  return this._name;
};

MethodSignature.prototype.getReturnType = function() {
  return this._returnType;
};

MethodSignature.prototype.getParameterAmount = function() {
  return this._parameterAmount;
};

MethodSignature.prototype.equals = function (other) {
  return this.toStr() === other.toStr();
};

MethodSignature.prototype.toStr = function () {
//print(TypeA,TypeB,TypeC)ReturnType
  var str;
  
  str = this._name + "(";
  if (this._parameterAmount > 0) {
  // Taking care of amount of commas
    str += this._parameterTypes[0].getType();
    var i;
	for (i = 1; i < this._parameterAmount; i++) {
	  str += "," + this._parameterTypes[i].getType();
	}
  }  
  str += ")" + this._returnType.getType();
  
  return str;  
};

function testing(){
  var methName = "testMeth";
  var methRet = new Type("LBird;");
  var ret1 = new Type("Z");
  var ret2 = new Type("B");
  var methParam = [ret1, ret2];
  var meth = new MethodSignature(methName, methRet, methParam);

  assert(meth.toStr() === "testMeth(Z,B)L", "Something went wrong in the toStr");
  assert(meth.getParameterAmount() === 2, "Wrong number of parameters in method");
};