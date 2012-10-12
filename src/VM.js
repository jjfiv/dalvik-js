'use strict';

// vm.js
// This is the core of the VM
// This is not global; initVM returns a new VM object

var VM = function() {
  this._threads = [];
};

VM.prototype.createThread = function( _directMethod ) {
  var _newThread = new Thread();
  _newThread.pushMethod(_directMethod);
  this._threads.push(_newThread);
};

VM.prototype.start = function ( _classList, _mainClass ) {
  var _publicStaticVoidMain = null;

  // TODO this will probably be done often enough to merit being its own function
  var _i, _j, _class, _m;
  for(_i = 0; _i < _classList.length; _i++) {
    _class = _classList[_i];

    if(_class.name === _mainClass) {
      for(_j = 0; _j < _class.directMethods.length; _j++) {
        _m = _class.directMethods[_j];

        if( _m.name === "main" &&
            _m.returnType === "V" &&
            _m.params.length === 1 &&
            _m.params[0] === "[Ljava/lang/String;") {
          _publicStaticVoidMain = _m;
        }
      }
    }
  }

  if(_publicStaticVoidMain === null) {
    terminal.println("main could not be found in " + _mainClass);
    return false;
  }

  this.createThread(_publicStaticVoidMain);
  return true;
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





