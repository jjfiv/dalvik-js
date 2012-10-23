// Instance.js 
// depdendencies:

var Instance = function(_type, _fields){
  // type must refer to the class
  this.type = _type;
  this.fields = _fields;
};

Instance.prototype.new = function (){
  return new Instance(this.type.clone(), this.fields.map(function(_f){return _f.clone();}));
};
