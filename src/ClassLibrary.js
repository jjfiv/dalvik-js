// ClassLibrary.js
// Manages the classes currently loaded
// dependencies:

var ClassLibrary = function() {
  this.classes = {
      "Ljava/lang/Object;" : new Class(new Type("Ljava/lang/Object;"))
  };
};

ClassLibrary.prototype.addClass = function(_class){
  var _className = _class.getTypeString();
  if (this.classes[_className]){
    console.log("WARNING: "+_className+" already inserted into ClassLibrary.");
  } else {
    this.classes[_className] = _class;
    return true;
  }
};

ClassLibrary.prototype.defineClasses = function(classes){
  // grab via Upload.js's callback -> only accessible function is dex.classes
  classes.forEach(this.addClass, this);
};

ClassLibrary.prototype.findClass = function (_type){
  var _class = this.classes[_type.getTypeString()]; 
  assert(!(isUndefined(_class)), _type.getTypeString()+" not in ClassLibrary.");
  return _class;
};

ClassLibrary.prototype.findMethod = function(_type, _methodSignature){
  var _i, _m, _class = this.classes[_type.getTypeString()];
  var _allMethods = _class.directMethods.concat(_class.virtualMethods);
  while (isUndefined(_m)) {
    for (_i=0;_i<_allMethods.length;_i++){
      if (_allMethods[_i].signature.isEquals(_methodSignature)){
        _m = _allMethods[_i]; break;
      }
    }
    if (isUndefined(_class.parent)) {
      break;
    }
    _class = this.classes[_class.parent.getTypeString()];
    _allMethods = _class.directMethods.concat(_class.virtualMethods);
  }
  assert(!(isUndefined(_m)), _type.getTypeString()+" does not have a method named "+_methodSignature.name);
  return _m;
};
