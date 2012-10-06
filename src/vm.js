'use strict'

// vm.js
// This is the core of the VM
// This is not global; initVM returns a new VM object

var makeVM = function() {

  return {
    threads: [],


    createThread: function( _directMethod ) {
      var _newThread = {

        // magical result register
        _result: null, 

        // stack of frames
        _stack: [],  

        // start executing a given method
        pushMethod: function(_m) {
          var _i;
          var _frame = {
            pc: 0,
            regs: [],
            method: _m,
          };

          for(_i=0; _i<_m.numRegisters; _i++) {
            this.regs[_i] = 0;
          }

          // TODO load up regs with arguments; I think we need to do this backwards?

          this.stack.push(_frame);
	      }, //ends pushMethod
        
        // grab the current frame object
        currentFrame: function() {
          var _s = this.stack;
          var _len = _s.length;
          
          // this assert may be too paranoid eventually
          assert(_len !== 0, "Looking for non-existent stack frame!")

          return _s[_len-1]
        }, //ends currentFrame
        
        getRegister: function(_idx) {
          return this.currentFrame().regs[_idx]
        }, //ends getRegister

        setRegister: function(_idx, _value) {
          this.currentFrame().regs[_idx] = _value
        }, //ends setRegister

        setResult: function(_value) {
          result = _value;
        }
        
        throwException: function(_obj) {
          var type = _obj.type; //TODO, have instances designed

          // find current method
          // find list of catches
          // find first match
          // frame.pc = firstMatch.pc
          // assert(nextInstruction == "move-exception")
        }, //ends throwException

        // do the next instruction
        doNextInstruction: function() {
          terminal.println(this.statusString())

          var _frame = this.currentFrame()
          var _inst = _frame.method.icode[_frame.pc]

          // see icode.js
          var _handler = icode[_inst.op];

          if(isUndefined(_handler)) {
            assert(0, "UNSUPPORTED OPCODE!");
          }

          var _inc = _handler(_inst, this);
          _frame.pc += (isUndefined(_inc)) ? 1 : _inc;
        },

        // summarize where we are
        statusString: function() {
          var _f = this.currentFrame()
          return "in " + _f.method.name + " pc=" + _f.pc + " nextInstr=" + _f.method.icode[_f.pc] + " regs: " + _f.regs
        } //ends statusString
      }


      threads.push(newThread)
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





