//
// Upload class
//
// Handles the File Input object as needed
// dependencies: ArrayFile.js, dexLoader.js
//

var Upload = function(_cbk, _vm) {
  var _self = this;
  this._classChooser = new ClassChooser();
  this._loadButton = document.getElementById('loadButton');
  this._runButton = document.getElementById('runButton');
  this._fileInput = document.getElementById('fileInput');
  this.onFileReady = _cbk;
  this._loadButton.addEventListener('click', function(evt) { _self.onClickLoad(evt); }, false);
  this._runButton.addEventListener('click', function(evt) { 
                                     var _cc = _self._classChooser;
                                     _vm.clear();
                                     if (_cc.selectedIndex()!==-1){
                                       _vm.start(_cc.selectedItem());
                                       while(_vm.hasThreads()){
                                         _vm.clockTick();
                                       }
                                     }
                                   }, false);
};

Upload.prototype.onClickLoad = function(clickEvent) {
  var selectedFiles = this._fileInput.files;
  var i;

  var fileReady = function(self, f){
    return function(loadEvent) {
      var target = loadEvent.target;
      var byteArray = new Uint8Array(target.result);
      
      console.log('fileReady!');
      console.log(target);
    
      // this error happens when in Chrome with default settings
      if(target.result === null) {
        console.log(target.error);
        console.log("Are you facing the Chrome security problem?");
        return;
      }

      console.log('Loaded "' +f.name+'"');

      self.onFileReady(f.name, byteArray);
    };
  };

  console.log(selectedFiles);

  for(i=0; i<selectedFiles.length; i++) {
    var f = selectedFiles[i];

    var reader = new FileReader(); // browser API class
    var self = this;

    //reader.onload = fileReady;
    reader.onloadend = fileReady(self, f);
    reader.readAsArrayBuffer(f);

    console.log(reader);
  }
};

