const Resource = require('../auth/resource.js');
const Api = require('../auth/api.js');
const SessionUtil = require('@flyme/skynet-utils/lib/sessionUtil.js');
const Data = require('../utils/data.js');

module.exports = {
  get: function(server, options){
    return {
        authenticate: (request, reply) => {
          if(Resource.doContinue(request, reply) && Api.doContinue(request, reply)){
            reply.continue({ credentials: { state: request.state } });
            return;
          }
          var redirect = `//${request.headers.host}/login?useruri=${request.url.href}`;
          SessionUtil.updateByRequest(request, 'end');
          var userInfo = SessionUtil.getByRequest(request);
          if(!userInfo){
            if(Api.isApi(request)){
              reply(Data.format('', '', 302, request.headers.referer || `//${request.headers.host}/request.headers.referer`));
              return;
            }else{
              reply.redirect(redirect).state('session', null);
            }
          }else{
            if(!Api.just(userInfo, request, reply)){
              reply(Data.format('', '无权访问', 403));
              return;
            }
            reply.continue({ credentials: { state: request.state } });
          }
        }
    };
  },
  init: function(server){
    server.auth.scheme('custom', this.get);
    server.auth.strategy('default', 'custom');
  }
}
