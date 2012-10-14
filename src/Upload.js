//
// Upload class
//
// Handles the File Input object as needed
// dependencies: ArrayFile.js, dexLoader.js
//

var Upload = function() {
  this.loadButton = document.getElementById('loadButton');
  this.fileInput = document.getElementById('fileInput');

  var self = this;
  this.callback = function(evt) { self.onClickLoad(evt); };

  this.loadButton.addEventListener('click', this.callback, false);

  console.log("Hello");
};

Upload.prototype.onClickLoad = function(clickEvent) {
  var selectedFiles = this.fileInput.files;
  var i;

  var fileReady = function(loadEvent) {
    console.log('fileReady!');
    console.log(target);
    var target = loadEvent.target;

    // this error happens when in Chrome with default settings
    if(target.result === null) {
      console.log(target.error);
      console.log("Are you facing the Chrome security problem?");
      return;
    }

    console.log('Loaded "' +f.name+'"');

    var byteArray = new Uint8Array(target.result);
    self.onFileReady(f.name, byteArray);
  };

  console.log(selectedFiles);

  for(i=0; i<selectedFiles.length; i++) {
    var f = selectedFiles[i];

    var reader = new FileReader(); // browser API class
    var self = this;

    //reader.onload = fileReady;
    reader.onloadend = fileReady;
    reader.readAsArrayBuffer(f);

    console.log(reader);
  }
};

// TODO have a protocol for setting this callback
Upload.prototype.onFileReady = function(fileName, fileData) {
  // DEXData is from dexLoader.js
  var dex = new DEXData(new ArrayFile(fileData));
};

var upload = new Upload();

