var Service = require('@flyme/skynet-db');
const ApiUtil = require('./util.js');
const Data = require('../../utils/data.js');
const md5 = require('md5');



module.exports = {
  dealConfigManage(data, name, state, reply){
    switch(name){
      case 'getConfigs':
        this.getConfigs(data, reply);
        break;
      case 'doConfigDelete':
        this.doConfigDelete(data, reply);
        break;
      case 'doConfigAdd':
        this.doConfigAdd(data, reply);
        break;
    }
  },
  doConfigDelete(data, reply){
    Service.findByIdAndRemove('manage-config', '', data.id, () => {
      ApiUtil.pageQueryPerDay(data, reply, 'doConfigDelete', `manage-config`, {}, {}, true);
    }, function(err){
      err && reply(Data.format('', '删除失败'));
    });
  },
  doConfigAdd(data, reply){
    Service.find('manage-config', '', {
      name: data.name
    }, (r) => {
      if(r.length){
        reply(Data.format('', '该名称已被使用', 502));
        return;
      }
      Service.save('manage-config', '', data, () => {
        delete data.detail;
        delete data.name;
        ApiUtil.pageQueryPerDay(data, reply, 'doConfigAdd', 'manage-config', {}, {}, true);
      }, function(err){
        err && reply(Data.format('', '添加失败'));
      });
    }, function(err){
      err && reply(Data.format('', '添加失败'));
    });
  },
  getConfigs(data, reply){
    data.name = '';
    ApiUtil.pageQueryPerDay(data, reply, 'getConfigs', `manage-config`, {}, {}, true);
  }
}
