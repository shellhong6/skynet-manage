const LoadModule = require('../common/loadModule.js');
const Path = require('path');
const Apis = LoadModule.loadDir(Path.resolve(__dirname, '../api-module'));
const LogUtil = require('@flyme/skynet-utils/lib/logUtil.js');

Apis.analysisApi.getResources({
  'name':'appStore-welfare',
  'query_start':1491753600000,
  'query_end':1491840000000,
  'query_page':'all'
}, function(){
  LogUtil.log(arguments[0].value.domain);
});
