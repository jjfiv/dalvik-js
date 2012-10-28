// Class.js
// dependencies: ClassLibrary
var Class = function (_name, _accessFlags, _parent, _interfaces, _staticFields, _instanceFields, _directMethods, _virtualMethods) {		
  this.name = _name;
  this.accessFlag = _accessFlags;
  this.parent = _parent;		
  this.interfaces = _interfaces || [];

  this.staticFields = _staticFields || [];
  this.instanceFields = _instanceFields || [];

  this.directMethods = _directMethods || []; // directMethods are "static" or class methods
  this.virtualMethods = _virtualMethods || []; // virtualMethods are instance methods
};

var Instance = function(_type, _fields){
  // type must refer to the class
  this.type = _type;
  if (_fields) {
    this.fields = _fields;      
  } else {
    assert(false, "what to do in the event of instantiation without args? Are there default args we should be filling in?");
  }
};

Instance.prototype.getClass = function (){
  var _cl = __currentVM__.classLibrary;
  return _cl.findClass(this.type);
};

Class.prototype.hasMain = function() {
  var _foo = this.directMethods.map(function(_method){ return _method.isMain(); });
  if(_foo.length === 0) {
    return false;
  }
  return _foo.reduce(function(a, b){ return a || b; });
};

Class.prototype.getMain = function(){
  var _main = this.directMethods.filter(function(_method){ return _method.isMain(); });
  assert(_main.length===1, 'There should only be one main method per class.');
  return _main[0];
};

Class.prototype.makeNew = function(){
  return new Instance(this.name.clone(), this.instanceFields.map(function(_f){ return _f.clone();}));
};

Class.prototype.getTypeString = function(){
  return this.name.getTypeString();
};
