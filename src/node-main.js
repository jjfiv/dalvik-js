//--- this is a file meant to allow things to be run from node.js
//

// better, custom assert for nodejs only
#define assert(condition, message) \
  if(!(condition)) { console.log(__FILE__ + ":" + __LINE__ + ": Assert("+#condition+") failed! \""+message+"\""); }

#include "util.js"

// --- custom terminal for nodejs
var terminal = {
  print: function(s) {
    process.stdout.write(s)
  },
  println: function(s) {
    this.print(s+'\n')
  }
}

#include "icode.js"
#include "mock-hello.js"
#include "Class.js"
#include "Field.js"
#include "Method.js"
#include "Thread.js"
#include "VM.js"

//--- main
var myVM = new VM();
myVM.start(mock_hello_classes, "Ltest/HelloWorld;");

while(myVM.hasThreads()) {
  myVM.clockTick();
}

