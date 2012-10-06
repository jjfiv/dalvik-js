'use strict'

// vm.js
// This is the core of the VM
// This is not global; initVM returns a new VM object

var makeVM = function() {

  return {
    threads: [],

    createThread: function( _directMethod ) {
      var _newThread = new Thread();
      _newThread.pushMethod(_directMethod);

      threads.push(_newThread)
    }, // ends createThread

    //--- main entry point of VM
    start: function(_classList, _mainClass) {
      var _publicStaticVoidMain = null

      for(_class in _classList) {
        if(_class.name === _mainClass) {
          for(_m in _class.directMethods) {
            if(_m.name === "main" &&
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
    }, //ends start
  

    //--- clock tick; round-robin scheduler
    //    for now, do one instruction per thread

    clockTick: function () {
      for(_thread in threads) {
        _thread.doNextInstruction()
      }
    } //ends clockTick

  }
}


//--- example usage
var myVM = makeVM();
myVM.start(classes, "Ltest/HelloWorld;");

while(myVM.running()) {
  myVM.clockTick();
}





