//
// Class Chooser
//
// Dependencies:
//   Type.js
//   html from index.html
// 

var ClassChooser = function() {
  this._listView = document.getElementById('runnableClasses');
  var _self = this;
};

ClassChooser.prototype._optList = function() {
  return this._listView.options;
};

ClassChooser.prototype.selectedIndex = function() {
  return this._optList().selectedIndex;
};

ClassChooser.prototype.clear = function() {
  // remove the first item until the list is empty
  while(this._optList().length > 0) {
    this._optList.remove(0);
  }
};

ClassChooser.prototype.addClass = function(type) {
  var _option = document.createElement('option');
  _option.text = type.toDots();
  _option.value = type.toStr();
  this._optList().add(_option);
};

ClassChooser.prototype.selectedItem = function() {
  if(this.selectedIndex() === -1) {
    return undefined;
  }
  var _option = this._optList()[this._optList().selectedIndex];
  return new Type(_option.value);
};

/*
 * Just to prove that it works...
 * var classChooser = new ClassChooser();
 * classChooser.addClass(new Type("Ljava/lang/String;"));
*/

