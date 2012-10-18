var addRow = function(_tableId, _testId, _expected, _actual) {
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

var doTest = function(testId, classes, mainClass, expectedOutput) {
  //--- main
  var myVM = new VM();
  myVM.start(classes, mainClass);

  while(myVM.hasThreads()) {
    console.log("\t"+myVM.getThreadState()+"\n", document.body);
    myVM.clockTick();
  }

  output = document.getElementById('output').innerHTML;
  var tableId = (output === expectedOutput) ? "passTable" : "failTable";
  addRow(tableId, testId, expectedOutput, output);

  document.getElementById('output').innerHTML = "";
};

var classSet = [];
classSet.push({
  name: "Ltest/PrintFortyFive;",
  directMethods: [
    {
      name: "main",
      returnType: "V",
      params: ["[Ljava/lang/String;"],
      numRegisters: 2,
      icode: [
        {op: "static-get", dest: 0, field:"Ljava/lang/System;.out:Ljava/io/PrintStream;"},
        {op: "move-const", dest: 1, value: 45},
        {op: "invoke", kind: "virtual", argumentRegisters: [0, 1], method: "Ljava/io/Printstream;.println"},
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
      returnType: "V",
      params: ["[Ljava/lang/String;"],
      numRegisters: 2,
      icode: [
        {op: "static-get", dest: 0, field:"Ljava/lang/System;.out:Ljava/io/PrintStream;"},
        {op: "move-const", dest: 1, value: "Hello World!"},
        {op: "invoke", kind: "virtual", argumentRegisters: [0, 1], method: "Ljava/io/Printstream;.println"},
        {op: "return"}
        ]
    },
  ]
});

doTest("println(45)", classSet, "Ltest/PrintFortyFive;", "45\n");
doTest("println(100)", classSet, "LPrintHello;", "Hello World!\n");

