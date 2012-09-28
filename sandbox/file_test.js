var output = document.getElementById('output')
var print = function(str) {
  output.appendChild(document.createTextNode(str+"\n"))
}

print(window.File && window.FileReader && window.FileList && window.Blob && true);

var inspect = function(obj) {
  for(var key in obj) {
    print("\""+key + "\" : \"" + obj[key] + "\"")
  }
}

var loadedFiles = []

var onClickLoad = function(evt) {
  var fileInput = document.getElementById('fileInput')
  var files = fileInput.files
  var i, N=files.length;

  loadedFiles = []

  for(i=0; i<N; i++) {
    var f = files[i];
    inspect(f)

    var reader = new FileReader()
    reader.onload = function(evt) {
      var target = evt.target

      // this happens in Chrome with default settings
      if(target.result === null) {
        console.log(target.error);
        return;
      }

      print('loaded "'+f.name+'"')
      inspect(target)
      var byte_array = new Uint8Array(target.result)
      loadedFiles.push({
        name: f.name,
        data: byte_array,
      })
    }

    reader.readAsArrayBuffer(f)
  }
}

var onClickShow = function(evt) {
  var i,N=loadedFiles.length;

  for(i=0; i<N; i++) {
    var f = loadedFiles[i];
    print("loaded["+i+"]="+f.name+" size:"+f.data.length)
  }

}

var loadButton = document.getElementById('loadButton')
loadButton.addEventListener("click", onClickLoad, false);

var showButton = document.getElementById('showButton')
showButton.addEventListener("click", onClickShow, false);

