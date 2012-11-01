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
    "println" : function(kind, method, args) {
      var _type = method.signature.parameterTypes[0].getTypeString();
      var _value = args[1];
      console.log("println " + _value + " to " + inspect(args[0]) + "!");

      if (_type === "D"){
        terminal.println(doubleFromgLong(_value));
      } else if (_type === "Z") {
        if (_value !== 0) {
          terminal.println ("true");
        } else {
          terminal.println ("false");
        }
      } else {
        terminal.println (_value);
      }
    }
  },
  "Ljava/lang/Object;" : { 
      "<init>" : function(kind, method, args) {
          // commented out because it looks like an error
          console.log("Skipping super constructor for now.");
          return args[0];
      },
      "toString" : function(kind, method, args){
      },
      "getClass" : function(kind, method, args) {
          // doesn't work
          //var _thread = arguments[0];
          //_thread.result=args[0].getClass(_thread.getClassLibrary);
      }
  }
};

var isRunnable = function (_type, _classLibrary){
  var _class = _classLibrary.findClass(_type);
  return _class.interfaceOf(new Type('Ljava/lang/Runnable;'), _classLibrary);
};

var threadHandler = function(_thread, _kind, _method, _args){
  
  var _threadOps = {
    "<init>" : function () { 
      var _newThread = _args[0];
      // fill the fields with args or something to initialize?
      var _run = _thread.getClassLibrary().findMethodByName(_newThread.threadClass, 'run');
      _newThread.pushMethod(_run);
    },                                                         
    "start" : function () { 
      var _newThread = _args[0]; 
      assert(isA(_newThread, 'Thread'), 'The 0th register of instance methods on Threads ought to be a reference to the thread itself.');
      _newThread.state = 'RUNNABLE';
    }
  };  

  _threadOps[_method.getName()]();
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
var makeRegistersForMethod = function(_method, _kind, _argValues) {
  
  // do some sort of sanity check on the number of registers
  var maxCount = _method.numRegisters;
  var actCount = _argValues.length;
  
  assert(actCount <= maxCount, 'Total number of registers ('+maxCount+') should at least accomodate arguments ('+actCount+'). Failure on invoke-'+_kind+" "+_method.toString());

  // build the array appropriately
  var _i, _a = [];
  for (_i=0;_i<(maxCount - actCount);_i++){
    _a[_i]=0;
  }
  return _a.concat(_argValues);
};

var invoke = function(_inst,_thread){
  var kind = _inst.kind;
  var method = _inst.method;
  // convert given argument registers into the values of their registers
  var argValues = _inst.argumentRegisters.map(function (_id) { return _thread.getRegister(_id); });

  // if this is an invoke-super; it means that we call the current method's parent instead
  // resolve it before our _javaIntercept
  if(kind === 'super') {
    method = _thread.getClassLibrary().findMethodByName(method.definingClass, method.getName());
  }

  console.log('invoke');
  console.log(method);
  console.log(method.getName());
  console.log(method.definingClass.getTypeString());

  // find an override if there is one
  var _javaIntercept = (intercept[method.definingClass.getTypeString()] || {})[method.getName()];
  
  // if we have a native "javascript" handler for this method
  if (_javaIntercept){
    _thread._result = _javaIntercept(kind, method, argValues);
    return;
  }
  
  // if this is a runnable, catch certain special calls
  if (isRunnable(method.definingClass, _thread.getClassLibrary())){
    // TODO only catch some?
    //      should we integrate this with _javaIntercept?
    _thread._result = threadHandler(_thread, kind, method, argValues);
    return;
  }
  

  // make sure we haven't
  assert(!method.isNative(), "Native method ("+method.getName()+") is not implemented in Javascript, or not noticed by invoke() in invoke.js, so we have to crash now.");
  
  // create the register set for the new method
  var newRegisters = makeRegistersForMethod(method, kind, argValues);
  
  // push the method onto the VM
  _thread.pushMethod(method, newRegisters);
};
