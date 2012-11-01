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

var invokeSuper = function(_argValues, _method, _thread){
  var _a = [];
  var _superMethod = _thread.getClassLibrary().findMethodByName(_method.definingClass, _method.getName());
  for ( _i = 0 ; _i < (_argValues.length - _method.numParameters()) ; _i++ ){
    _a[_i]=0;
  }
  _thread.pushMethod(_method,_a.concat(_argValues));
};

var invokeVirtual = function(_argValues, _method, _thread){
  var _i, _a = [];
  for (_i=0;_i<(_argValues.length-_method.numParameters());_i++){
    _a[_i]=0;
  }
  _thread.pushMethod(_method,_a.concat(_argValues));
};

var invokeDirect = function(_argValues, _method, _thread){
  var _i, _a = [];
  for (_i=0;_i<(argRegs.length-method.numParameters());_i++){
    _a[_i]=0;
  }
 _thread.pushMethod(method,_a.concat(_argValues));
};

var invokeInterface = function(_argValues, _method, _thread){

}

var invoke = function(_inst,_thread){
  var kind = _inst.kind;
  var method = _inst.method;
  var argRegs = _inst.argumentRegisters;
  // convert given argument registers into the values of their registers
  var argValues = argRegs.map(function (_id) { return _thread.getRegister(_id); });
  var _javaIntercept = (intercept[method.definingClass.getTypeString()] || {})[method.getName()];
  assert(method.isNative() || argRegs.length<=_numRegisters
         ,'Total number of registers ('+method.numRegisters+') should at least accomodate arguments ('+argRegs.length+'). Failure on '+method.getName());
  if (_javaIntercept){
    _javaIntercept(kind, method, argRegs, argValues);
  } else if (isRunnable(method.definingClass, _thread.getClassLibrary())){
    threadHandler(_inst, _thread);
  } else {
      if (kind==='virtual'){
        invokeVirtual(argValues, method, _thread);
      } else if (kind==='direct'){
        invokeDirect(argValues, method, _thread);
      } else if (kind==='super'){
        invokeSuper(argValues, method, _thread);
      } else if (kind==='interface'){
        invokeInterface(argValues, method, _thread);
      } else {
        assert(false, "Unknown invoke kind=\""+kind+"\"");
      }
    }
};
