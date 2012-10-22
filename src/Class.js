// Class.js
// dependencies:
var Class = function (name, accessFlags, parent) {		
  this.name = name;
  this.accessFlag = accessFlags;
  this.parent = parent;		
  this.interfaces = arguments[3] || [];

  this.staticFields = arguments[4] || [];
  this.instanceFields = arguments[5] || [];

  this.directMethods = arguments[6] || []; // directMethods are "static" or class methods
  this.virtualMethods = arguments[7] || []; // virtualMethods are instance methods
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
