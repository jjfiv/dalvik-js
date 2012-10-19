
// This file contains a definitoin of a Type object
// Dependencies: gLong.js

'use strict';

var Type = function (typeString) {
  var dimNum, num;
  // Copying the full type name to a type member
  this._typeString = typeString;
  
  // Counting number of array dimensions
  this._arrayDim = typeString.lastIndexOf("[") + 1;
  dimNum = this._arrayDim; // Useful for later calcs
  
  // Getting the objectType of the Type, always first letter after last [
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

Type.prototype.getName = function() {
  return this._name;
};

Type.prototype.getType = function() {
  return this._type;
};

Type.prototype.getArrayDim = function() {
  return this._arrayDim;
};

Type.prototype.isEquals = function( other ) {
    // right now just comparing type strings
    // Do we want to just consider _name and _type?
    return this.toStr() === other.toStr();
};

Type.prototype.toDots = function () {
  if (this._type === "L") {
    var str1, str2;
	str1 = this._typeString.substr(this._arrayDim + 1);
	// A RegExp is needed to replace more than one instance of a string
	str2 = str1.replace(/\//g, ".");	
	return str2;
  }
  // Returning the typeName as it is after arrays + type letter
  return str1;
};

Type.prototype.toStr = function() {
  return this._typeString;
};

Type.prototype.isArray = function() {
  return this._arrayDim > 0;
};

Type.prototype.isClass = function() {
  return this._type === "L";
};

Type.prototype.isVoid = function () {
  return this._typeString === 'V';
};

Type.prototype.isPrimitive = function () {
  var primitives = new Array ("V", "Z", "B", "S", "C", "I", "J", "F", "D");
  if (primitives.indexOf(this._type) > -1) {
    return true;
  } else {
    return false;
  }
};

Type.prototype.getArrayBase = function() {
  return new Type(this._typeString.substr(this._arrayDim));
};

Type.prototype.defaultJSObject = function() {
  if( this.isArray() ) {
    return [];
  }
  if (this.isClass() ) {
    return {
      type: this,
      value: { }
    };
  }
  if (this.isPrimitive() ) {
    if (this._type === "Z") {
	  return { // Boolean
	    type: this,
		value: false
	  };	
	} else if (this._type === "B") {
	  return { // Byte
	    type: this,
		value: 0
	  };
	} else if (this._type === "S") {
	  return { // Short
	    type: this,
		value: 0
	  };
	} else if (this._type === "C") {
	  return { // Char
	    type: this,
		value: 0
	  };
	} else if (this._type === "I") {
	  return { // Int
	    type: this,
		value: 0
	  };
	} else if (this._type === "J") {
	  return { // Long
	    type: this,
		value: gLong.fromNumber(0)
	  };
	} else if (this._type === "F") {
	  return { // Float
	    type: this,
		value: 0.0
	  };
    } else if(this._type === "D") {
	  return { // Double
	    type: this,
		value: 0.0
	  };
    } else {
	  assert("Undefined primitive type");
	}// end of if selecting appropriate primitive type
  } // end of if isPrimitive
};

//--- Primitive Types:
// V,Z,B,S,C,I,J,F,D
var TYPE_VOID    = new Type('V');
var TYPE_BOOLEAN = new Type('Z');
var TYPE_BYTE    = new Type('B');
var TYPE_SHORT   = new Type('S');
var TYPE_CHAR    = new Type('C');
var TYPE_INT     = new Type('I');
var TYPE_LONG    = new Type('J');
var TYPE_FLOAT   = new Type('F');
var TYPE_DOUBLE  = new Type('D');
var TYPE_OBJECT  = new Type('Ljava/lang/Object;');

var t = new Type("LBird;");
console.log(t.toStr());
console.log(t.getName());
assert(t.isArray() === false, "Making sure bird is not an array");
assert(t.getArrayDim() === 0, "Making sure the array is of 0 dimensions");
assert(t.getType() === "L", "Making sure the type is a complicated class");
assert(t.getName() === "Bird", "Making sure type name is Bird");

var jStringType = new Type("Ljava/lang/String;");
console.log(jStringType.toDots());
assert(jStringType.isArray() === false, "Making sure String is not an array");

var arrayOfStrings = new Type("[Ljava/lang/String;");
console.log(arrayOfStrings.toDots());
assert(arrayOfStrings.isArray() === true, "Making sure String is not an array");

assert(arrayOfStrings.getArrayBase().isEquals(jStringType), "The base of an array of strings ought to be a string");




