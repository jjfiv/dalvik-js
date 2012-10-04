'use strict'

// vm.js
// This is the core of the VM
// This is not global; initVM returns a new VM object

var initVM = function() {

  return {
    threads = []


    createThread: function( directMethod ) {
      var newThread = {

        // magical result register
        result: null, 

        // stack of frames
        stack: [],  

        // start executing a given method
        pushMethod: function(m) {
          var frame = {
            pc: 0,
            regs: [],
            method: method,
          };

          var i;
          for(i=0; i<method.numRegisters; i++) {
            regs[i] = 0;
          }

          // TODO load up regs with arguments; I think we need to do this backwards?


        },
        
        // grab the current frame object
        currentFrame: function() {
          var s = this.stack;
          var len = s.length;
          
          // this assert may be too paranoid eventually
          assert(len !== 0, "Looking for non-existent stack frame!")

          return s[len-1]
        }
        
        getRegister: function(idx) {
          return currentFrame().regs[idx]
        },

        setRegister: function(idx, value) {
          currentFrame().regs[idx] = value
        },

        setResult: function(value) {
          result = value;
        }
        
        throwException: function(obj) {
          val type = obj.type; //TODO, have instances designed

          // find current method
          // find list of catches
          // find first match
          // frame.pc = first_match.pc
          // assert(nextInstruction == "move-exception")
        },

        // do the next instruction
        doNextInstruction: function() {
          terminal.println(statusString)

          var frame = this.currentFrame()
          var inst = frame.method.icode[frame.pc]

          // see icode.js
          var handler = icode[inst.op];

          if(typeof(handler) === 'undefined') {
            assert(0, "UNSUPPORTED OPCODE!");
          }

          handler(inst, this);
          frame.pc++;
        },

        // summarize where we are
        statusString: function() {
          var f = this.currentFrame()
          return "in " + f.method.name + " pc="+f.pc+" nextInstr=" f.method.icode[f.pc]+ " regs: " + f.regs
        }
      }


      threads.push(newThread)
    },

    //--- main entry point of VM
    start: function(classList, mainClass) {
      var publicStaticVoidMain = null

      for(class in classList) {
        if(class.name === mainClass) {
          for(m in class.directMethods) {
            if(m.name === "main" && m.returnType === "V" && m.params.length === 1 && m.params[0] === "[Ljava/lang/String;") {
              publicStaticVoidMain = m;
            }
          }
        }
      }

      if(publicStaticVoidMain === null) {
        terminal.println("main coulclassList, mainClassd not be found in " + mainClass);
        return false
      }

      startThread(publicStaticVoidMain)
      return true
    },
  

    //--- clock tick; round-robin scheduler
    //    for now, do one instruction per thread

    clockTick: function () {
      for(thread in threads) {
        thread.doNextInstruction()
      }
    }

  }
}


