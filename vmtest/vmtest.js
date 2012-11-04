//Global var to hold all opcodes for the final summary

var opCodes = new function(){
  // first create a hash of opcode names and their numbers
  var ops={}, i;
  for (i=0;i<opName.length;i++){
    ops[opName[i]]={ opcode : '0x'+i.toString(16), //display string in hex, to facilitate searching the spec
                     files : []
                   };
  }
  this.ops = ops;
  this.addOps = function(icodeUsage, currentFile){
    var codesAtThisFile = icodeUsage[currentFile];
    for (code in codesAtThisFile){
      if (codesAtThisFile.hasOwnProperty(code)){
        ops[code].files.push(currentFile);
      }
    }
  };
}();


//
// This method is mostly taken from various sites, just adds the
// given entry to the given table defined by HTML, hard to find
// an example that doesn't depend on jQuery
//
var _addRow = function(_tableId, _testId, _expected, _actual, _dcodes) {
  var _table = document.getElementById(_tableId);
  var _numRows = _table.rows.length;
  var _row = _table.insertRow(_numRows);

  var _idcell = _row.insertCell(0);
  _idcell.innerHTML = _testId;

  var _expcell = _row.insertCell(1);
  _expcell.innerHTML = _expected;
  
  var _actcell = _row.insertCell(2);
  _actcell.innerHTML = _actual;

  var _dcodecell = _row.insertCell(3);
  _dcodecell.innerHTML = _dcodes;
};

//
// // This method creates a VM, runs the test, captures the output, and clears it// Creates an entry in the appropriate table when run."V"
//
var doTest = function(fileName, mainClass, expectedOutput) {
  var _outField = document.getElementById('output');
  var _clearOutput = function() {
    _outField.innerHTML = "";
  };

  _clearOutput();

  //--- mainClass
  var _output, _dcodes="";
  try {

    var classes = (new DEXData(new ArrayFile(files[fileName]))).classes;
    var myVM = new VM();
    myVM.currentFile = fileName;
    myVM.icodeUsage = {
        };

    myVM.defineClasses(gStdLib);
    myVM.defineClasses(classes);
    myVM.start(new Type(mainClass));

    while(myVM.hasThreads()) {
        
      myVM.clockTick();
    }

    _output = _outField.innerHTML;
    opCodes.addOps(myVM.icodeUsage, fileName);
    var codeSet = myVM.icodeUsage[fileName];
    for (code in codeSet){
        
      if (codeSet.hasOwnProperty(code)){
          
        _dcodes+=","+code;
      }
    }
    _dcodes = _dcodes.slice(1);
  } catch (exception) {
    _output = exception;
  }

  //console.log(_output);
  var tableId = (_output === expectedOutput) ? "passTable" : "failTable";
  _addRow(tableId, fileName, expectedOutput, _output, _dcodes);

  _clearOutput();
};
