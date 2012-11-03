// Class.js
// dependencies: ClassLibrary, Class, Type, Field, Thread
//
var Instance = function(_type, _fields){
  // type must refer to the class
  this.type = _type;
  if (_fields) {
    this.fields = _fields;      
  } else {
    assert(false, "what to do in the event of instantiation without args? Are there default args we should be filling in?");
  }
  this.monitorLockTaken = false;
};


Instance.prototype.getClass = function (_classLibrary){
  return _classLibrary.findClass(this.type);
};

Instance.prototype.getTypeString = function (){
  return this.type.getTypeString();
};

Instance.prototype.getField = function (_field) {
  var _retVal =  this.fields.filter(function (_f) { return _f.isEquals(_field); });
  assert(_retVal.length===1, _retVal.length+" fields named "+_field.name+" found for "+_field.definingClass.getTypeString());
  return _retVal[0];
};

Instance.prototype.toString = function() {
  return "Instance of " + this.getTypeString();
};

