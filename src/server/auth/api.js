const Constant = require('../utils/constant.js');
module.exports = {
  doContinue(request, reply){
    var path = request.path;
    if(path.indexOf('/api/') == -1){
      return true;
    }
    if(path == '/api/login/doLogin'){
      return true;
    }
    return false;
  },
  just(userInfo, request, reply){
    var role = userInfo.role;
    var path = request.path;
    if(role.indexOf('admin') != -1 || path.indexOf('/api/') == -1){
      return true;
    }
    if(Constant.auth[role].indexOf(path.match(/\/api\/([^/]+)\//)[1]) != -1){
      return true;
    }
    return false;
  },
  isApi(request){
    var path = request.path;
    if(path.indexOf('/api/') != -1){
      return true;
    }
    return false;
  }
}
