// ClassLibrary.js
// Manages the classes currently loaded
// dependencies:

var ClassLibrary = function() {
  this._classes = {};
};

ClassLibrary.prototype.addClass = function(_class){
  var _className = _class.name.getName();
  if (this._classes[_className]){
    throw _className+" already inserted";
  } else {
    this._classes[_className] = _class;
    return true;
  }
};

ClassLibrary.prototype.defineClasses = function(_classes){
  // grab via Upload.js's callback -> only accessible function is dex.classes
  _classes.forEach(this.addClass, this);
};

ClassLibrary.prototype.findClass = function (_type){
  var _c = this._classes[_type.getName()]; 
  return new Class(_c.name, _c.parent, _c.accessFlags, _c.interfaces
                   , _c.staticFields, _c.instanceFields, _c.directMethods, _c.virtualMethods);
};

ClassLibrary.prototype.getClasses = function(){
  return this._classes;
};