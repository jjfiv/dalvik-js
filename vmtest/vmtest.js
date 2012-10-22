
//
// This method is mostly taken from various sites, just adds the
// given entry to the given table defined by HTML, hard to find
// an example that doesn't depend on jQuery
//
var _addRow = function(_tableId, _testId, _expected, _actual) {
  var _table = document.getElementById(_tableId);
  var _numRows = _table.rows.length;
  var _row = _table.insertRow(_numRows);

  var _idcell = _row.insertCell(0);
  _idcell.innerHTML = _testId;

  var _expcell = _row.insertCell(1);
  _expcell.innerHTML = _expected;
  
  var _actcell = _row.insertCell(2);
  _actcell.innerHTML = _actual;
};

//
// This method creates a VM, runs the test, captures the output, and clears it
// Creates an entry in the appropriate table when run."V"
//
var doTest = function(testId, classes, mainClass, expectedOutput) {
  var _outField = document.getElementById('output');
  var _clearOutput = function() {
    _outField.innerHTML = "";
  };

  _clearOutput();

  //--- main
  var myVM = new VM();
  myVM.start(classes, mainClass);

  while(myVM.hasThreads()) {
    myVM.clockTick();
  }

  var _output = _outField.innerHTML;
  var tableId = (_output === expectedOutput) ? "passTable" : "failTable";
  _addRow(tableId, testId, expectedOutput, _output);

  _clearOutput();
};

var classSet = [];
classSet.push({
  name: "Ltest/PrintFortyFive;",
  directMethods: [
    {
      name: "main",
      returnType: TYPE_VOID,
      params: [TYPE_ARR_STRING],
      numRegisters: 2,
      icode: [
        {op: "static-get", dest: 0, field:"Ljava/lang/System;.out:Ljava/io/PrintStream;"},
        {op: "move-const", dest: 1, value: 45},
        {op: "invoke", kind: "virtual", argumentRegisters: [0, 1], methodName: "Ljava/io/Printstream;.println(I)V"},
        {op: "return"}
        ]
    }
  ]
});

classSet.push({
  name: "LPrintHello;",
  directMethods: [
    {
      name: "main",
      returnType: TYPE_VOID,
      params: [TYPE_ARR_STRING],
      numRegisters: 2,
      icode: [
        {op: "static-get", dest: 0, field:"Ljava/lang/System;.out:Ljava/io/PrintStream;"},
        {op: "move-const", dest: 1, value: "Hello World!"},
        {op: "invoke", kind: "virtual", argumentRegisters: [0, 1], methodName: "Ljava/io/Printstream;.println(Ljava/lang/String;)V"},
        {op: "return"}
        ]
    },
  ]
});

classSet.push({
  name: "LAdd0;",
  directMethods: [
    {
      name: "main",
      returnType: TYPE_VOID,
      params: [TYPE_ARR_STRING],
      numRegisters: 3,
      icode: [
        {op: "move-const", dest: 1, value: 20},
        {op: "move-const", dest: 2, value: 22},
        {op: "add", dest:1, srcA:1, srcB: 2, type: TYPE_INT},
        {op: "static-get", dest: 0, field:"Ljava/lang/System;.out:Ljava/io/PrintStream;"},
        {op: "invoke", kind: "virtual", argumentRegisters: [0, 1], methodName: "Ljava/io/Printstream;.println(I)V"},
        {op: "return"}
        ]
    },
  ]
});

classSet.push({
  name: "LAddWide0;",
  directMethods: [
    {
      name: "main",
      returnType: TYPE_VOID,
      params: [TYPE_ARR_STRING],
      numRegisters: 3,
      icode: [
        {op: "move-const", dest: 1, value:gLong.fromNumber(42) },
        {op: "move-const", dest: 2, value:gLong.fromString("10000000000") }, // 10 bil
        {op: "add", dest:1, srcA:1, srcB: 2, type: TYPE_LONG},
        {op: "static-get", dest: 0, field:"Ljava/lang/System;.out:Ljava/io/PrintStream;"},
        {op: "invoke", kind: "virtual", argumentRegisters: [0, 1], methodName: "Ljava/io/Printstream;.println(J)V"},
        {op: "return"}
        ]
    },
  ]
});

doTest('println(45)', classSet, "Ltest/PrintFortyFive;", "45\n");
doTest('println("Hello World!")', classSet, "LPrintHello;", "Hello World!\n");
doTest('20+22', classSet, "LAdd0;", "42\n");
doTest('10bil+42', classSet, "LAddWide0;", "10000000042\n");

