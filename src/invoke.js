// invoke.js 
// Takes care of everything an invoke call could want.
// This is also where we're going to deal with intercepting calls to java stuff,
// as well as threads.

var NYI = function(_inst) {
  console.log("Instruction " + _inst.op + " from Dalvik '"+_inst.dalvikName+"' not yet implemented.");
  throw "Not Implemented";
};

var intercept = {
  "Ljava/io/PrintStream;" : { 
    "println" : function(kind, method, argRegs, argValues) {
        console.log("print " + argValues[1] + " to " + inspect(argValues[0]) + "!");
        if (method.signature.parameterTypes[0].getTypeString() === "D"){
            terminal.println(doubleFromgLong(argValues[1]));
        } else if (method.signature.parameterTypes[0].getTypeString() === "Z") {
            if (argValues[1] === 1) {
                terminal.println ("true");
            } else {
                terminal.println ("false");
            }
        } else {
            terminal.println (argValues[1]);
        }
    }
  },
  "Ljava/lang/Object;" : { 
      "<init>" : function() {
          // commented out because it looks like an error
          //console.log("Skipping super constructor for now.");
      },
      "toString" : function(){
      },
      "getClass" : function() {
          // doesn't work
          //var _thread = arguments[0];
          //_thread.result=argValues[0].getClass(_thread.getClassLibrary);
      }
  }
};

var isRunnable = function (_type, _classLibrary){
  var _class = _classLibrary.findClass(_type);
  return _class.interfaceOf(new Type('Ljava/lang/Runnable;'), _classLibrary);
};

var threadHandler = function(_inst, _thread){
  var _threadOps = {
    "<init>" : function () { 
      var _newThread = _thread.getRegister(0);
      // fill the fields with args or something to initialize?
      var _run = _thread.getClassLibrary().findMethodByName(_newThread.threadClass, 'run');
      _newThread.pushMethod(_run);
    },
    "start" : function () { 
      var _newThread = _thread.getRegister(0); 
      assert(isA(_newThread, 'Thread'), 'The 0th register of instance methods on Threads ought to be a reference to the thread itself.');
      _newThread.state = 'RUNNABLE';
    }
  };  
  _threadOps[_inst.method.getName()]();
};

/*
 * makeRegistersForMethod
 *
 *  Dalvik calling convention
 *  if there are five registers on the target method
 *  and there are three registers [1,2,3] with the call
 *
 *  the registers are loaded in order, aligned right
 *  target.registers = [ nothing, nothing, 1, 2, 3 ]
 */
var makeRegistersForMethod = function(_method, _argValues) {
  
  // do some sort of sanity check on the number of registers
  var maxCount = _method.numParameters();
  var actCount = _argValues.length;
  assert(actCount <= maxCount, 'Total number of registers ('+maxCount+') should at least accomodate arguments ('+actCount+'). Failure on '+method.getName());

  // build the array appropriately
  var _i, _a = [];
  for (_i=0;_i<(argRegs.length-method.numParameters());_i++){
    _a[_i]=0;
  }
  return _a.concat(_argValues);
};

var invoke = function(_inst,_thread){
  var kind = _inst.kind;
  var method = _inst.method;
  var argRegs = _inst.argumentRegisters;
  // convert given argument registers into the values of their registers
  var argValues = argRegs.map(function (_id) { return _thread.getRegister(_id); });

  // if this is an invoke-super; it means that we call the current method's parent instead
  // resolve it before our _javaIntercept
  if(kind === 'super') {
    method = _thread.getClassLibrary().findMethodByName(method.definingClass, method.getName());
  }

  // find an override if there is one
  var _javaIntercept = (intercept[method.definingClass.getTypeString()] || {})[method.getName()];
  
  // if we have a native "javascript" handler for this method
  if (_javaIntercept){
    _thread.result = _javaIntercept(kind, method, argRegs, argValues);
    return;
  }
  
  // if this is a runnable, catch certain special calls
  if (isRunnable(method.definingClass, _thread.getClassLibrary())){
    // TODO only catch some?
    //      should we integrate this with _javaIntercept?
    _thread.result = threadHandler(_inst, _thread);
    return;
  }
  

  // make sure we haven't
  assert(!method.isNative(), "Native method ("+method.getName()+") is not implemented in Javascript, or not noticed by invoke() in invoke.js, so we have to crash now.");
  
  // create the register set for the new method
  var newRegisters = makeRegistersForMethod(method, argValues);
  
  // push the method onto the VM
  _thread.pushMethod(method, newRegisters);
};
