// pools.js
// From http://source.android.com/tech/dalvik/dalvik-bytecode.html:
// There are separately enumerated and indexed constant pools for references to strings, types, fields, and methods.
// Comments, Issues, etc:
// Currently the arrays are not preset in size. They seem to be more like hashtables. I feel like we ought to have something that loops over the bytes of the thing we're writing.

var debug = true;

function typeOfConstant(thing){
    // Returns the type of the constant: string (0), type (1), field (2), or method (3)
    // Not sure how constants are going to be denoted; save implementation until later
    // For now we say that everything is a string.
    return 0;
}

var constantPool = new Array(4);
constantPool.write = function(constant){
    var t = typeOfConstant(constant);
    var currentSize = this[t] ? this[t].length : (this[t]=[]).length;
    var index = ((currentSize - 1) / 32 + 1) * 32;
    for (i=0;i<constant.length;i++){
	constantPool[t][i+index]=constant[i];
    }
    return this[t];
}