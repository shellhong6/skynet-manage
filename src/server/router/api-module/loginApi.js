const SessionUtil = require('@flyme/skynet-utils/lib/sessionUtil.js');
const Data = require('../../utils/data.js');
var Service = require('@flyme/skynet-db');
const md5 = require('md5');
const BaseUtil = require('../../utils/base.js')

Service.setOptions('occasional');

module.exports = {
  dealLogin(data, name, state, reply, request){
    switch(name){
      case 'doLogin':
        this.doLogin(data, state, reply, request);
        break;
    }
  },
  doLogin(data, state, reply, request){
    var session = request.state.session;
    var useruri = data.useruri || `${request.headers.origin}/index`;
    //已登录过而且未过期
    if(session && SessionUtil.get(session.sessionId)){
      session.last = Date.now();
      reply.redirect(useruri).state('session', session);
      return;
    }
    //未登录过
    var password = md5(data.password);
    Service.find('manage-user', '', {
      name: data.name,
      password: password
    }, function(arr){
      if(arr && arr.length){
        var guid = BaseUtil.getGUID(),
            one = arr[0];
        SessionUtil.add(guid, {
          role: one.role,
          name: one.name,
          password: password
        });
        session = {
          sessionId: guid,
          last: Date.now()
        };
        reply(Data.format('', '', 302, useruri)).state('session', session);
        return;
      }
      reply(Data.format('', '用户名或密码错误', 502));
    }, function(err){
      err && reply(Data.format('', '登录失败', 502));
    });
  }
}
