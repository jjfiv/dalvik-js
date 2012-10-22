// vm.js
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
  if (DEBUG) { console.log('starting VM on '+_selectedClassAsType.getName()); }
  var _class = this.classLibrary.findClass(_selectedClassAsType);
  return this.createThread(_class.getMain()) && true;
};

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





