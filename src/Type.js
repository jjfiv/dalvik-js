'use strict'

// This file contains a definitoin of a Type object

var Type = function (typeString) {
  var dimNum, num;
  // Copying the full type name to a type member
  this._typeString = typeString;
  
  // Counting number of array dimensions
  this._arrayDim = typeString.lastIndexOf("[") + 1;
  dimNum = this._arrayDim; // Useful for later calcs
  
  // Getting the objectType of the Type, always first letter of [
  this._type = typeString.substr(dimNum, 1);
  
  // Extracting pure type name
  num = typeString.lastIndexOf("/");
  // length - num - 2 cause we have a ";" at the end and 0-based array
  if (num > -1) {
    this._name = typeString.substr(num + 1, typeString.length - num - 2);
  } else {    
    this._name = typeString.substr(dimNum + 1, typeString.length - dimNum - 2);
  }
};

Type.prototype.isArray = function() {
  return this._arrayDim > 0;
};

Type.prototype.defaultJSObject = function() {
  if( this.isArray() ) {
    return new Array();
  } else if (this.isClass() ) {
    return {
      type: this,
      value: { }
    }
  }
};


Type.prototype.isEquals = function( other ) {
  
}


var t = new Type("LBird;");
console.log(t._arrayDim);
console.log(t._type);
assert(t.isArray() === false, "Making sure bird is not an array");
assert(t._arrayDim === 0, "Making sure the array is of 0 dimensions");
assert(t._type === "L", "Making sure the type is a complicated class");
assert(t._name === "Bird", "Making sure type name is Bird");