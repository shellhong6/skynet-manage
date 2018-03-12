var fs = require('fs');

module.exports = {
  loadDir(path, exclude){
    var result = {};
    var files = fs.readdirSync(path);
    files.forEach(function(filename) {
      if(!exclude || exclude.indexOf(filename) == -1){
        result[filename.match(/[^.]*/)[0]] = require(path + (path.lastIndexOf('/') == path.length - 1 ? '' : '/') + filename);
      }
    });
    return result;
  }
}
