'use strict'

// vm.js
// This is the core of the VM
// This is a global; initVM returns a new VM object

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
        
        thread 
        // grab the current frame object
        currentFrame: function() {
          var s = this.stack;
          var len = s.length;
          
          // this assert may be too paranoid eventually
          assert(len !== 0, "Looking for non-existent stack frame!")

          return s[len-1]
        }
        
        
        // do the next instruction
        doNextInstruction: function() {
          terminal.println(statusString)

          var frame = this.currentFrame()
          var inst = frame.method.icode[frame.pc]

          if(inst.op == "return") {
            stack.pop()
          } else {
            frame.pc++
          }
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


