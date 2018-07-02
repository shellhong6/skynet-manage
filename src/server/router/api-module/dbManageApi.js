const Data = require('../../utils/data.js');
const Mongoose = require('mongoose');
var Service = require('@flyme/skynet-db');
const Config = require('@flyme/skynet-db/lib/config.js');
const LogUtil = require('@flyme/skynet-utils/lib/logUtil.js');
const SessionUtil = require('@flyme/skynet-utils/lib/sessionUtil.js');



module.exports = {
  dealDb(data, name, state, reply, request){
    switch(name){
      case 'getDbList':
        this.getDbList(data, reply, request);
        break;
      case 'doDbDelete':
        this.doProjectDelete(data, reply, request);
        break;
      case 'getQDbList':
        this.getQDbList(data, reply, request);
        break;
      case 'batchDbDelete':
        this.batchDbDelete(data, reply, request);
        break;
    }
  },
  getDbList(data, reply, request){
    Service.getDbList('manage-user', function(err, r){
      if(err){
        reply(Data.format({}, err.message, 5002));
      }
      reply(Data.format(r));
    });
  },
  doProjectDelete(data, reply, request){
    var name = data.dbName;
    LogUtil.log('begin delete db: ', name, 'username:', SessionUtil.getByRequest(request).name, ' time:', new Date().toString());
    Service.dropDatabase(name, function(isOk){
      if(isOk){
        reply(Data.format({}, `删除${name}成功`));
      }else{
        reply(Data.format({}, `删除${name}失败`, 5002));
      }
    });
  },
  getQDbList(data, reply, request){
    var query = data.query;
    this.getDbList(data, (r) => {
      var dbList = r.value,
          arr = [],
          db = null;
      arr = dbList.filter(function(db){
        return db.name.indexOf(query) != -1;
      });
      reply(Data.format(arr, `获取成功`));
    }, request);
  },
  batchDbDelete(data, reply, request){
    var query = data.query,
        arr = query.split(',');
    if(arr.length > 200){
      reply(Data.format({}, `删除个数不允许超过200个`, 5003));
      return;
    }
    var length = arr.length;
    var _d = function(evn, arr, request){
      var name = arr.pop();
      if(!name)return;
      evn.doProjectDelete({
        dbName: name
      }, function(){
        if(arr.length){
          _d(evn, arr, request);
        }else{
          reply(Data.format({}, `成功删除${length}个`));
        }
      }, request);
    };
    _d(this, arr, request);
  }
}
