const Data = require('../../utils/data.js');
const Mongoose = require('mongoose');
var Service = require('@flyme/skynet-db');
const Config = require('@flyme/skynet-db/lib/config.js');
const LogUtil = require('@flyme/skynet-utils/lib/logUtil.js');
const SessionUtil = require('@flyme/skynet-utils/lib/sessionUtil.js');



module.exports = {
  dealCo(data, name, state, reply, request){
    switch(name){
      case 'getCoList':
        this.getCoList(data, reply, request);
        break;
      case 'doCoDelete':
        this.doCoDelete(data, reply, request);
        break;
      case 'getQCoList':
        this.getQCoList(data, reply, request);
        break;
      case 'batchCoDelete':
        this.batchCoDelete(data, reply, request);
        break;
    }
  },
  getCoList(data, reply, request){
    Service.getCoList(function(err, r){
      if(err){
        reply(Data.format({}, err.message, 5002));
        return;
      }
      reply(Data.format(r));
    });
  },
  doCoDelete(data, reply, request){
    var name = data.name;
    Service.dropCollection(name, function(err, r){
      if(err){
        reply(Data.format({}, err.message, 5002));
        return;
      }
      reply(Data.format({}, `删除${name}成功`));
    });
  },
  getQCoList(data, reply, request){
    var query = data.query;
    Service.getCoNames((err, r) => {
      if(err){
        reply(Data.format({}, err.message, 5002));
        return;
      }
      var arr = [],
          Co = null;
      arr = r.filter(function(coName){
        return coName.indexOf(query) != -1;
      });
      reply(Data.format(arr, `获取成功`));
    });
  },
  batchCoDelete(data, reply, request){
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
      evn.doCoDelete({
        name: name
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
