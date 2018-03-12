var Service = require('@flyme/skynet-db');
const Data = require('../../utils/data.js');
const LogUtil = require('@flyme/skynet-utils/lib/logUtil.js');

Service.setOptions('occasional');

module.exports = {
  pageQueryPerDay(data, reply, fnName, type, conditions, sortParams, noFilter){
    Service.pageQuery(data.cur, data.pageSize, '', type, data.name, conditions, sortParams, function(err, r){
      if(err){
        reply(Data.format({}, err.message));
        LogUtil.error(`projectName: ${data.name},  time: ${new Date().toString()}, ${fnName} err: ${err.message}`);
        return;
      }
      reply(Data.format(r));
    }, function(query){
      if(noFilter === true){
        return query;
      }
      return query.where('_reportServerTime').gt(data.query_start).lt(data.query_end);
    });
  }
}
