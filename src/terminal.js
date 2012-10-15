/*
 * This file contains all functions related to I/O
 * This should be the only place that knows how to
 * communicate with the HTML page, for our own sanity.
 *
 * Eventually, the terminal could be a lot more complicated,
 * but for now it should just offer simple printing.
 *
 */

var DEBUG = true;
var ICODES = { 
    codes : {},
    keys : [],
    putICODE : function(_key){         
        if (!ICODES.codes[_key]){
            ICODES.codes[_key]=_key;
            ICODES.keys.push(_key);
        }
    },        
    listICODES : function() {
        var _i, _s="";
        for (_i = 0 ; _i < ICODES.keys.length ; _i++){
            _s+=ICODES.keys[_i]+",";
        }
        return _s;
    }
}

var HTMLTerminal = function() {
  this._output = document.getElementById('output');
};

HTMLTerminal.prototype.print = function(str) {
  this._output.appendChild(document.createTextNode(str));
};

HTMLTerminal.prototype.println = function(str) {
  this.print(str + '\n');
};

HTMLTerminal.prototype.appendDebug = function(data, docObj){
    docObj.innerText+=data;
};

HTMLTerminal.prototype.listICODES = function(docObj){
    docObj.innerText+=ICODES.listICODES();
}

//--- global
var terminal = new HTMLTerminal();

