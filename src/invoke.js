// invoke.js 
// Takes care of everything an invoke call could want.
// This is also where we're going to deal with intercepting calls to java stuff,
// as well as threads.

//
// Turn values into strings for print
//
var printValueOfType = function(_type, _value) {
  assert(_value !== null, "println invoked on javascript null?");
  if (_type === "D"){
    terminal.print(doubleFromgLong(_value));
  } else if (_type === "F") {
    terminal.print(floatFromInt(_value));
  } else if (_type === "Z") {
    if (_value !== 0) {
      terminal.print ("true");
    } else {
      terminal.print ("false");
    }
  } else if (_type === "Ljava/lang/String;") {
    /* JF ignore this for now
    if(isUndefined(_value.fields)) {
      var _result = _value.fields[3].value._data.null;
      for (var _i = 1; _i < _value.fields[0].value; _i++) {
        _result = _result + _value.fields[3].value._data[_i];
      }
      terminal.print (_result);
    } else {*/
    terminal.print (_value);
  } else if (_type === "C") {
    terminal.print (String.fromCharCode(_value));
  } else if (_type === "Ljava/lang/Object;") {
    if (!isUndefined (_value.fields[0].type._type)) {
      if (_value.fields[0].type._type === "J") {
        if (!isUndefined (_value.fields[0].value)) {
          terminal.print (_value.fields[0].value.toString());
        }
      }
    }
  } else {
    terminal.print (_value);
  }
};

var isRunnable = function (_type, _classLibrary){
  var _class = _classLibrary.findClass(_type);
  return _class.interfaceOf(new Type('Ljava/lang/Runnable;'), _classLibrary);
};

var intercept = {
  "Ljava/io/PrintStream;" : { 
    "println" : function(thread, method, args) {
      var paramTypes = method.signature.parameterTypes;

      
      if(paramTypes.length === 1) {
        var _type = paramTypes[0].getTypeString();
        var _value = args[1];
        printValueOfType(_type, _value);
      }

      //add a newline
      terminal.println('');
    },
    "print" : function(thread, method, args) {
      var paramTypes = method.signature.parameterTypes;
      
      if(paramTypes.length === 1) {
        var _type = paramTypes[0].getTypeString();
        var _value = args[1];
        printValueOfType(_type, _value);
      }
    }
  },

  "Ljava/lang/reflect/Array;" : { 
    "newInstance" : function(thread, method, args) {
      return args[1];
    }
  },
  "Ljava/lang/Thread;" : {
    "<init>" : function(thread, method, args) {
      assert(args.length === 1, "Thread<init> only implemented for 1 arg\n");
      var _newThread = args[0];
      var _run = thread.getClassLibrary().findMethod(_newThread.thread.threadClass, new MethodSignature('run', TYPE_VOID));
      _newThread.thread.pushMethod(_run, makeRegistersForMethod(_run, 'virtual', [_newThread]));

      return _newThread;
    },
    "start" : function (thread, method, args) { 
      var _newThread = args[0]; 
      assert(isA(_newThread.thread, 'Thread'), 'The 0th register of instance methods on Threads ought to be a reference to the thread itself.');
      _newThread.thread.state = 'RUNNABLE';

      return _newThread;
    }
  },
  "Ljava/lang/Object;" : { 
    "<init>" : function(thread, method, args) {
      // commented out because it looks like an error
      //console.log("Skipping super constructor for now.");
      return args[0];
    },
    "toString" : function(thread, method, args){
    },
    "getClass" : function(thread, method, args) {
      return args[0].getClass(thread.getClassLibrary());
    }
  },
  "Ljava/lang/Class;" : {
    "isPrimitive" : function(thread, method, args){
      return args[0].type.isPrimitive();
    },
    "getCanonicalName" : function(thread, method, args) {
      return args[0].type.toDots();
    },
  },
  "Ljava/lang/Throwable;" : { 
    "<init>" : function(thread, method, args) {
      // commented out because it looks like an error
      return args[0];
    }
  },
  "Ljava/lang/System;" : { 
    "arraycopy" : function(thread, method, args){
      args[2]._data = args[0]._data;
    },
    "currentTimeMillis" : function(thread, method, args){
      return gLong.fromNumber(new Date().getTime());
    }
  },
  "Ljava/lang/IntegralToString;" : { 
    "appendInt" : function(thread, method, args){
      if (args[0].fields[0].value === "DEFAULT_FIELD_VALUE") {
        args[0].fields[2].value.null = args[1].toString();
        args[0].fields[0].value = 1;
      } else {
        args[0].fields[2].value[args[0].fields[0].value] = args[1].toString();
        args[0].fields[0].value++;
      }
    }
  },
  "Ljava/lang/Integer;" : { 
    "parseInt" : function(thread, method, args) {
      return parseInt(args[0], 10);
    },
  },
  "Ljava/lang/String;" : { 
    "length" : function(thread, method, args){
      return args[0].length;
    },
    "equals" : function(thread, method, args) {
      assert(isString(args[0]), "String equals on strings");
      assert(isString(args[1]), "String equals on strings");
      return args[0] === args[1];
    },
    "charAt" : function(thread, method, args) {
      assert(isString(args[0]), "String equals on strings");
      return args[0].charCodeAt(args[1]);
    }
  },
  "Ljava/lang/StringBuilder;" : { 
    "<init>" : function(thread, method, args){
      return "";
    },
    "append" : function(thread, method, args){
      return "" + args[0] + args[1];
    },
    "toString" : function(thread, method, args){
      return "" + args[0];
    }
  }
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
  return _a.concat(_argValues).slice(0);
};

var invoke = function(_inst,_thread){
  var kind = _inst.kind;
  var method = _inst.method;
  // convert given argument registers into the values of their registers
  var argValues = _inst.argumentRegisters.map(function (_id) { return _thread.getRegister(_id); });

  //console.log('invoke-'+kind);
  //console.log(_inst);
  //console.log(argValues);
  //console.log(method);
  //console.log(method.getName());
  //console.log(method.definingClass.getTypeString());
  //
  // if this is an invoke-super; it means that we call the current method's parent instead
  // resolve it before our _javaIntercept
  if(kind === 'super') {
    method = _thread.getClassLibrary().findMethod(method.definingClass, method.signature);
  }

  if((kind === 'interface') && (method.definingClass.getTypeString() !== "Ljava/lang/StringBuilder;")){
    // method is currently set to the interface's abstract method; replace with the 
    // instance's method. instance is sitting in the 0th arg, as usual.
    method = _thread.getClassLibrary().findMethod(argValues[0].type, method.signature);
  }

  // make sure we have the best version of this method
  if (!method.defined && !method.definingClass.isEquals(TYPE_OBJECT) ) {
    method = _thread.getClassLibrary().findMethod (_inst.method.definingClass, _inst.method.signature);
  }

  if (method.accessFlags & 0x400){
    // if the method is abstract
    method = _thread.getClassLibrary().findMethod(_thread._result.type, method.signature);
  }

  // find an override if there is one
  var _javaIntercept = (intercept[method.definingClass.getTypeString()] || {})[method.getName()];
  // if we have a native "javascript" handler for this method
  if (_javaIntercept){
    _thread._result = _javaIntercept(_thread, method, argValues);
    return;
  }

  assert(!method.isNative(), "Native method ("+method.definingClass.getTypeString()+"."+method.getName()+") is not implemented in Javascript, or not noticed by invoke() in invoke.js, so we have to crash now.");
  
  // create the register set for the new method
  var newRegisters = makeRegistersForMethod(method, kind, argValues);
  
  // push the method onto the VM
  _thread.pushMethod(method, newRegisters);
};
