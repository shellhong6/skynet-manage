const Fs = require('fs');
module.exports = {
  readFile: function(path, callback){
    Fs.readFile(path, 'utf8', function(err, data) {
      if (err) {
        console.log(err);
      }
      callback && callback(err, data);
    });
  },
  writeFile: function(data, path, callback){
    Fs.writeFile(path, data, function(err) {
      if (err) {
        console.log(err);
      }
      callback && callback(err);
    });
  }
}
