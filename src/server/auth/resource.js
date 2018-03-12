var Cookie = require('cookie');
var Data = require('../utils/data.js');

module.exports = {
  doContinue(request, reply){
    var path = request.path;
    if(path.indexOf('/api/') != -1){
      return true;
    }
    if(request.path != '/index'){
      return true;
    }
    return false;
  }
}
