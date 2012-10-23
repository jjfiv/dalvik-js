// Instance.js 
// depdendencies:

var Instance = function(_type, _fields){
  // type must refer to the class
  this.type = _type;
  this.fields = _fields;
};

Instance.prototype.new = function (){
  return new Instance(this.type, this.fields);
};
