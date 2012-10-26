
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
var doTest = function(fileName, mainClass, expectedOutput) {
  var _outField = document.getElementById('output');
  var _clearOutput = function() {
    _outField.innerHTML = "";
  };


  _clearOutput();

  //--- main
  var _output;
  try {
    var classes = (new DEXData(new ArrayFile(files[fileName]))).classes;
    var myVM = new VM();
    
    myVM.defineClasses(gStdLib);
    myVM.defineClasses(classes);
    myVM.start(new Type(mainClass));

    while(myVM.hasThreads()) {
      myVM.clockTick();
    }

    _output = _outField.innerHTML;
  } catch (exception) {
    _output = exception;
  }

  console.log(_output);
  var tableId = (_output === expectedOutput) ? "passTable" : "failTable";
  _addRow(tableId, fileName, expectedOutput, _output);

  _clearOutput();
};




