// vm.jm
// This is the core of the VM
// dependencies: Upload.js, Thread.js, ClassLibrary.js

var VM = function() {
  var _self = this;
  this._threads = [];
  this.classLibrary = new ClassLibrary();
  this._source = function(){
      try { 
        return new Upload(function(_fileName, _fileData){
                            var _dex = new DEXData(new ArrayFile(_fileData));
                            var _k, _classes = _self.classLibrary._classes;
                            _self.defineClasses(_dex.classes);
                            for (_k in _classes){
                              this._classChooser.addClass(_classes[_k].name);
                            }
                          }, _self);
      } catch (x) {
        //thinking about having this take any arguments to the VM constructor, but for now:
        return false;
      };
  }();
};

VM.prototype.defineClasses = function(_data){
  this.classLibrary.defineClasses(_data);
  if (DEBUG){ console.log(this.classLibrary._classes.toString()); }
};

VM.prototype.createThread = function( _directMethod ) {
  var _newThread = new Thread(this);
  _newThread.pushMethod(_directMethod);
  this._threads.push(_newThread);
};

VM.prototype.start = function ( _selectedClassAsType ) {
  // the consequent will be removed later; I put this in to resolve merge conflicts
  // without breaking Jennie's code. Responsibility for the following has moved to ClassLibrary.js
  if (arguments[1]){
    var _classList = arguments[0], _mainClass = arguments[1];
    var _publicStaticVoidMain = null;
    // TODO this would be rectified by having a class to handle all the defined classes and a method to "find class"
    // on class, there should be a method "find method"
    var _i, _j, _class, _m;
    for(_i = 0; _i < _classList.length; _i++) {
      _class = _classList[_i];

      if(_class.name === _mainClass) {
        for(_j = 0; _j < _class.directMethods.length; _j++) {
          _m = _class.directMethods[_j];

          if( _m.name === "main" &&
              _m.returnType.isEquals(TYPE_VOID) &&
              _m.params.length === 1 &&
              TYPE_ARR_STRING.isEquals(_m.params[0])) {
            _publicStaticVoidMain = _m;
          }
        }
      }
    }//end for-loop
    if(_publicStaticVoidMain === null) {
      terminal.println("main could not be found in " + _mainClass);
      return false;
    }
    this.createThread(_publicStaticVoidMain);
    return true;
  } else {
    // moving forward, this is how starting the VM will be implemented
    if (DEBUG) { console.log('starting VM on '+_selectedClassAsType.getName()); }
    var _class = this.classLibrary.findClass(_selectedClassAsType);
    return this.createThread(_class.getMain()) && true;
  }
}; //end start

VM.prototype.clockTick = function() {
  //--- clock tick; round-robin scheduler
  //    for now, do one instruction per thread
  var _i, _thread;
  for(_i=0; _i<this._threads.length; _i++) {
    _thread = this._threads[_i];
    _thread.doNextInstruction();
  }
  //--- remove all finished threads
  this._threads = this._threads.filter(function(_t) { return !_t.isFinished(); });
};

VM.prototype.getThreadState = function() {
  var _s="", _i;
  for (_i=0; _i<this._threads.length; _i++){
    _s+=this._threads[_i].toString()+"\t";
  }
  return _s;
};

VM.prototype.hasThreads = function() {
  return this._threads.length !== 0;
};