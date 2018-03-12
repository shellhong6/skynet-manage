'use strict';

const Hapi = require('hapi');
var Service = require('@flyme/skynet-db');
const Good = require('./src/server/router/good.js');
const Api = require('./src/server/router/api.js');
const Resource = require('./src/server/router/resource.js');
const Auth = require('./src/server/auth/main.js');
const SessionUtil = require('@flyme/skynet-utils/lib/sessionUtil.js');
const LogUtil = require('@flyme/skynet-utils/lib/logUtil.js');

Service.setOptions('occasional');

var server = new Hapi.Server();
server.connection({
  port: 8080
});
Auth.init(server);
Resource.init(server);
Api.init(server);
Good.init(server);
SessionUtil.init(server);

LogUtil.log('start monitor-manage-server success!');
