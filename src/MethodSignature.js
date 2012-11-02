// This file deals with method signature
// Dependencies: Type.js

var MethodSignature = function(_name, _returnType, _parameterTypes) { 
  var _i;
  this.name = _name;
  this.returnType = _returnType;
  this.parameterTypes = _parameterTypes || [];
  this.parameterAmount = _parameterTypes.length;
};

MethodSignature.prototype.isMain = function(){
  return this.name==='main' &&
         this.returnType.isEquals(TYPE_VOID) &&
         this.parameterTypes[0].isEquals(TYPE_ARR_STRING) &&
         this.parameterTypes.length === 1;
};

MethodSignature.prototype.isEquals = function (other) {
  return this.name === other.name &&
         this.returnType.isEquals (other.returnType) &&
         this.parameterTypes.toString() === other.parameterTypes.toString() &&
         this.parameterAmount === other.parameterAmount;
};

MethodSignature.prototype.toString = function () {
//print(TypeA,TypeB,TypeC)ReturnType
  var str;
  
  str = this.name + "(";
  if (this.parameterAmount > 0) {
  // Taking care of amount of commas
    str += this.parameterTypes[0].getTypeString();
    var i;
	for (i = 1; i < this.parameterAmount; i++) {
	  str += "," + this.parameterTypes[i].getTypeString();
	}
  }  
  str += ")" + this.returnType.getTypeString();
  
  return str;  
};

(function(){
  var methName = "testMeth";
  var methRet = new Type("LBird;");
  var ret1 = new Type("Z");
  var ret2 = new Type("B");
  var methParam = [ret1, ret2];
  var meth = new MethodSignature(methName, methRet, methParam);

  //assert(meth.toStr() === "testMeth(Z,B)L", "Something went wrong in the toStr");
  assert(meth.parameterAmount === 2, "Wrong number of parameters in method");
}());

