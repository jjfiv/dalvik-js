// Class.js
// dependencies:
var Class = function (name, accessFlags, parent, interfaces, staticFields,instanceFields,directMethods,virtualMethods) {		
  this.name = name;
  this.accessFlag = accessFlags;
  this.parent = parent;		
  this.interfaces = interfaces || [];

  this.staticFields = staticFields || [];
  this.instanceFields = instanceFields || [];

  this.directMethods = directMethods || []; // directMethods are "static" or class methods
  this.virtualMethods = virtualMethods || []; // virtualMethods are instance methods
};

Class.prototype.hasMain = function() {
  var _foo = this.directMethods.map(function(_method){ return _method.hasMain(); });
  return _foo.reduce(function(a, b){ return a || b; });
};

Class.prototype.getMain = function(){
  var _main = this.directMethods.filter(function(_method){ return _method.isMain(); });
  assert(_main.length==1, 'There should only be one main method per class.');
  return _main[0];
};

Class.prototype.makeNew = function(){
  return new Instance(this.name.clone(), this.instanceFields.map(function(_f){ return _f.clone();}));
};