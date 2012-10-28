
// This file contains a definitoin of a Type object
// Dependencies: gLong.js

var Type = function (typeString) {
  var dimNum, num;
  // Copying the full type name to a type member
  this._typeString = typeString;
  
  // Counting number of array dimensions
  this._arrayDim = typeString.lastIndexOf("[") + 1;
  dimNum = this._arrayDim; // Useful for later calcs
  
  // Getting the objectType of the Type, always first letter after last [
  this._type = typeString.substr(dimNum, 1);
  this._wide = false;
  if (this._type === "D" || this._type === "J") {
    this._type = true;
  }
  
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

Type.prototype.getTypeString = function() {
  return this._typeString;
};

Type.prototype.getArrayDim = function() {
  return this._arrayDim;
};

Type.prototype.isEquals = function( other ) {
    // right now just comparing type strings
    // Do we want to just consider _name and _type?
    return this.getTypeString() === other.getTypeString();
};

Type.prototype.toDots = function () {
  var str1, str2;
  str1 = this._typeString.substr(this._arrayDim + 1);
  
  if (this.isClass()) {
    // A RegExp is needed to replace more than one instance of a string
    str2 = str1.replace(/\//g, ".");	

    // it should end with a semicolon, chop it off
    assert(str2.charAt(str2.length - 1) === ';', "Classes must end with a semicolon");
    str2 = str2.substring(0, str2.length -1);

    return str2;
  }
  // Returning the typeName as it is after arrays + type letter
  return str1;
};

Type.prototype.isInnerClass = function(_outerClass){
  // if _outerClass is supplied, return truthy indicator of whether this type 
  // is an inner class of the supplied class. If _outerClass undefined, just return 
  // whether this is an inner class
  // TO DO: HANDLE UNCLEAN TYPE/CLASS DISTINCTIONS
  // this really ought to be in Class.js, but since we need to construct inner Classes
  // from their types and outer classes, it's stuck in here for now.
  var _ts, _regex, _result;
  if (_outerClass){
    _ts = _outerClass.getTypeString();
    _regex = new RegExp(_ts.substring(0, _ts.length-1)+".*\$");
  } else {
    _r = new RegExp(".*\$.*");
  }
  _result = _r.exec(this.getTypeString());
  return _result;
};

Type.prototype.clone = function(){
  return new Type(this.getTypeString());
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

Type.prototype.isWide = function () {
  return this._wide;
};

Type.prototype.isPrimitive = function () {
  var primitives = ["V", "Z", "B", "S", "C", "I", "J", "F", "D"];
  return primitives.indexOf(this._type) !== -1;
};

Type.prototype.getArrayBase = function() {
  return new Type(this._typeString.substr(this._arrayDim));
};

Type.prototype.trimNum = function(value) {
  if (this.isEquals(TYPE_BYTE)) {
    return value & 0xFF;
  }
  if (this.isEquals(TYPE_SHORT) || this.isEquals(TYPE_CHAR)) {
    return value & 0xFFFF;
  }
  if (this.isEquals(TYPE_INT)) {
    return value & 0xFFFFFFFF;
  }
  if (this.isEquals(TYPE_FLOAT)) {
    return floatFromDouble(value);
  }
  if (this.isEquals(TYPE_DOUBLE)) {
    return value;
  }
  
  assert(false, "This function doesn't implement trim for type " + type);
};

Type.prototype.defaultJSObject = function() {
  if( this.isArray() ) { // Array
    return [];	
  }
  if (this.isClass() ) { // Class
    return { };
  }
  if (this.isPrimitive() ) { // Primitives
    var primitives = ["V", "Z", "B", "S", "C", "I", "J", "F", "D"];
    var primIndex = primitives.indexOf(this._type);
    if ( primIndex === 1) { // Boolean
      return false;
    }
    if ((primIndex > 1) && (primIndex < 6)) { // Byte, Short, Chat, Int
      return 0;
    }
    if ( primIndex === 6) { // Long
      return gLong.fromNumber(0);
    }
    if ((primIndex === 7) || (primIndex === 8)) { // Float or Double
      return 0.0;
    }
    assert(false, "Undefined primitive type");
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

// assorted class constants
var TYPE_OBJECT  = new Type('Ljava/lang/Object;');
var TYPE_STRING  = new Type('Ljava/lang/String;');
var TYPE_ARR_STRING = new Type('[Ljava/lang/String;');

// unit tests
(function() {
  var t = new Type("LBird;");
  //console.log(t.toString());
  //console.log(t.getName());
  assert(t.isArray() === false, "Making sure bird is not an array");
  assert(t.getArrayDim() === 0, "Making sure the array is of 0 dimensions");
  assert(t._type === "L", "Making sure the type is a complicated class");
  assert(t.getName() === "Bird", "Making sure type name is Bird");

  var jStringType = new Type("Ljava/lang/String;");
  //console.log(jStringType.toDots());
  assert(jStringType.isArray() === false, "Making sure String is not an array");

  var arrayOfStrings = new Type("[Ljava/lang/String;");
  //console.log(arrayOfStrings.toDots());
  assert(arrayOfStrings.isArray() === true, "Making sure String is not an array");

  assert(arrayOfStrings.getArrayBase().isEquals(jStringType), "The base of an array of strings ought to be a string");
}());


