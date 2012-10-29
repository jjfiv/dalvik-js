// ClassLibrary.js
// Manages the classes currently loaded
// dependencies:

var ClassLibrary = function() {
  this._classes = {};
};

ClassLibrary.prototype.addClass = function(_class){
  var _className = _class.getTypeString();
  if (this._classes[_className]){
    console.log("WARNING: "+_className+" already inserted into ClassLibrary.");
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
  var _class = this._classes[_type.getTypeString()]; 
  assert(!(isUndefined(_class)), _type.getTypeString()+" not in ClassLibrary.");
  return _class;
};

ClassLibrary.prototype.getClasses = function(){
  return this._classes;
};