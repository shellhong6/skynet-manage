const Data = require('../../utils/data.js');
var Service = require('@flyme/skynet-db');
const LogUtil = require('@flyme/skynet-utils/lib/logUtil.js');
const SessionUtil = require('@flyme/skynet-utils/lib/sessionUtil.js');



module.exports = {
  dealAggregate(data, name, state, reply, request){
    switch(name){
      case 'doAggregate':
        this.doAggregate(data, reply, request);
        break;
      case 'doAggregateDelete':
        this.doAggregateDelete(data, reply, request);
        break;
    }
  },
  doAggregate(data, reply, request){
    Service.aggregate(data.type, data.project, JSON.parse(data.aggregateCode), function(err, r){
      if(err){
        reply(Data.format({}, err.message, 5002));
      }
      reply(Data.format(r));
    });
  },
  doAggregateDelete(data, reply, request){
    LogUtil.log('doAggregateDelete, username:', SessionUtil.getByRequest(request).name, ' time:', new Date().toString());
    Service.findByIdAndRemove(data.type, data.project, data.id, function(r){
      reply(Data.format(''));
    }, function(err, r){
      if(err){
        reply(Data.format({}, err.message, 5002));
      }
    });
  }
}
