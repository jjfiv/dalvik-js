// display icode coverage
var coverage = function(){
  var table = document.getElementById("usageTable");
  var ops = opCodes.ops;
  var nameCell, idCell, filesCell;
  for (op in ops){
    if (ops.hasOwnProperty(op)){
      var row = table.insertRow(table.rows.length);
      nameCell = row.insertCell(0);
      idCell = row.insertCell(1);
      filesCell = row.insertCell(2);
      nameCell.innerHTML = op;
      idCell.innerHTML = ops[op].opcode;
      filesCell.innerHTML = ops[op].files; //this needs to be string concat'ed and will return an object
    }
  }
};

coverage();


