'use strict'

// vm.js
// This is the core of the VM
// This is not global; initVM returns a new VM object

var VM = function() {
  this._threads = []
  this._running = false
}

VM.prototype.createThread = function( _directMethod ) {
  var _newThread = new Thread();
  _newThread.pushMethod(_directMethod);
  this._threads.push(_newThread)
}

VM.prototype.start = function ( _classList, _mainClass ) {
  var _publicStaticVoidMain = null

  // TODO this will probably be done often enough to merit being its own function
  for(_class in _classList) {
    if(_class.name === _mainClass) {
      for(_m in _class.directMethods) {
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
    return false
  }

  this.createThread(_publicStaticVoidMain)
  return true
}

VM.prototype.clockTick = function() {
  //--- clock tick; round-robin scheduler
  //    for now, do one instruction per thread
  for(_thread in this._threads) {
    _thread.doNextInstruction()
  }
}

//--- example usage
var myVM = new VM();
myVM.start(mock_hello_classes, "Ltest/HelloWorld;");

while(myVM.running()) {
  myVM.clockTick();
}





