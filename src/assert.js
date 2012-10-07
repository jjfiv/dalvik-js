'use strict';

var assert = function(_cond, _text) {
  if(!_cond) {
    throw Error('assert failed: ' + _text);
  }
};

