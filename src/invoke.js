var findSuperMethod = function(_method, _class, _classLib) {
  console.log(_class);
  console.log(_method);
  //var _j;

  //for (_j = 0; _j < 5; _j++) {
  //while (!(TYPE_OBJECT.isEquals(_class.name))) {
    var _i;
	
	var _mIndex = -1; 
	var _cName = _class.getTypeString()
	//var _mName = _method.getName();
	var _mName = _method.name;
	
	//for (_i = 0; _i < _classLib[_cName].directMethods.length; _i++) {
	for (_i = 0; _i < _class.directMethods.length; _i++) {
	  //if (_classLib[_cName].directMethods[_i].getName() === _mName) {
	  if (_class.directMethods[_i].name === _mName) {
	    _mIndex = _i;
	  }
	//}
	if (_mIndex > -1 ) {
	  return _class.directMethods[_mIndex];
	} else {
	  //findSuperMethod(_method, _class.parent, _classLib);
	  return -1;
	}
  }
};

var invoke = function(_inst,_thread){

    var kind = _inst.kind;
    var method = _inst.method;
    var argRegs = _inst.argumentRegisters;
    // convert given argument registers into the values of their registers
    var argValues = argRegs.map(function (_id) { return _thread.getRegister(_id); });

    //TODO handle more than just this method;
    //     will need to call into ClassLibrary to find things
    //if(methodName === "Ljava/io/PrintStream;.println") {
    // HACKERY BE THE NAME - isolating this in a function block
    var _hacks = function (_mname, _ts) {
      if (_mname==="println" && _ts.isEquals(new Type("Ljava/io/PrintStream;"))){
        return function() {
          console.log("print " + argValues[1] + " to " + inspect(argValues[0]) + "!");
          if (method.signature.parameterTypes[0]._typeString === "D"){
            terminal.println(doubleFromgLong(argValues[1]));
          } else if (method.signature.parameterTypes[0]._typeString === "Z") {
            if (argValues[1] === 1) {
              terminal.println ("true");
            } else {
              terminal.println ("false");
            }
          } else {
            terminal.println (argValues[1]);
          }};
      } else if (_mname==="<init>" && _ts.isEquals(new Type("Ljava/lang/Object;"))){
        return function(){
          console.log("Skipping super constructor for now.");
        };
      } else if (_mname==="toString" && _ts.isEquals(new Type("Ljava/lang/Object;"))){
        return function(){};
      } else if (_mname==="getClass" && _ts.isEquals(new Type("Ljava/lang/Object;"))){
        return function() {_thread.result=argValues[0].getClass(_thread._vm.classLibrary);};
      }
};
    var _hack = _hacks(method.getName(), method.definingClass);
    var _i, _a=[], _numRegisters = method.numRegisters+((kind==='virtual') ? 1 : 0);

    // actual execution begins here

    if (_hack){
      _hack();
    } else {
      assert(argRegs.length<=_numRegisters,'Total number of registers ('+method.numRegisters+') should at least accomodate arguments ('+argRegs.length+'). Failure on '+method.getName());
      // front pad arguments to comply with register alignment stuff
     for (_i=0;_i<(_numRegisters-argRegs.length);_i++){
	    if (_inst.kind === "super") {
	      var _class = _thread._vm.classLibrary.findClass(method.definingClass);
		  var _mIndex = -1;
		  var _j;
		  while (!(TYPE_OBJECT.isEquals(_class.type))) {
		  //while (_mIndex === -1) {
		  //for (_j = 0; _j < 5; _j++) {
		    _class = _thread._vm.classLibrary.findClass(_class.parent);
	        _mIndex = findSuperMethod(method.getName(), _class, _thread._vm.classLibrary);
		    console.log("_mIndex" + _mIndex);
			console.log("_class" + _class);
		  }
		  method = _mIndex;
		  console.log("invoke-super is WIP");
	    }
        _a[_i]=0;
      }
      _a=_a.concat(argValues);
      assert(_a.length===_numRegisters, "New method "+method.getName()+" is not being passed the correct number of registers("+_a.length+", when it should be "+argRegs.length+").");
      _thread.pushMethod(method,_a);
    }
};