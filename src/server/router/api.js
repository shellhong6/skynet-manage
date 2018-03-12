const LoadModule = require('./common/loadModule.js');
const Path = require('path');
const Apis = LoadModule.loadDir(Path.resolve(__dirname, 'api-module'));

module.exports = {
  deal(code, data, name, state, reply, request){
    switch(code){
      case 'base':
        Apis.baseApi.dealBase(data, name, state, reply, request);
        break;
      case 'aggregate-manage':
        Apis.aggregateManageApi.dealAggregate(data, name, state, reply, request);
        break;
      case 'project-manage':
        Apis.projectManageApi.dealProject(data, name, state, reply, request);
        break;
      case 'db-manage':
        Apis.dbManageApi.dealDb(data, name, state, reply, request);
        break;
      case 'user':
        Apis.userApi.dealUser(data, name, state, reply, request);
        break;
      case 'login':
        Apis.loginApi.dealLogin(data, name, state, reply, request);
        break;
      case 'analysis':
        Apis.analysisApi.dealAnalysis(data, name, state, reply, request);
        break;
      case 'code-manage':
        Apis.codeManageApi.dealCodeManage(data, name, state, reply, request);
        break;
      case 'auth-manage':
        Apis.authManageApi.dealAuthManage(data, name, state, reply);
        break;
      case 'config-manage':
        Apis.configManageApi.dealConfigManage(data, name, state, reply);
        break;
    }
  },
  initAuth: function(server){
    Api.init(server);
  },
  init(server){
    server.register(require('inert'), (err) => {
      if (err) {
          throw err;
      }
      server.route({
        method: 'POST',
        path: '/api/{code}/{name}',
        config: {
          auth: 'default',
          handler: (request, reply) => {
            var name = request.params.name,
                code = request.params.code,
                state = request.state,
                data = request.payload;
            this.deal(code, data, name, state, reply, request);
          }
        }
      });
    });
  }
}
