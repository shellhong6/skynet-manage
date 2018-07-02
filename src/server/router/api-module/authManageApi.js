var Service = require('@flyme/skynet-db');
const ApiUtil = require('./util.js');
const Data = require('../../utils/data.js');
const md5 = require('md5');



module.exports = {
  dealAuthManage(data, name, state, reply){
    switch(name){
      case 'getUsers':
        this.getUsers(data, reply);
        break;
      case 'getRoles':
        this.getRoles(data, reply);
        break;
      case 'doUserDelete':
        this.doUserDelete(data, reply);
        break;
      case 'doUserAdd':
        this.doUserAdd(data, reply);
        break;
    }
  },
  doUserDelete(data, reply){
    Service.findByIdAndRemove('manage-user', '', data.id, () => {
      ApiUtil.pageQueryPerDay(data, reply, 'doUserDelete', `manage-user`, {}, {}, true);
    }, function(err){
      err && reply(Data.format('', '删除失败'));
    });
  },
  doUserAdd(data, reply){
    Service.find('manage-user', '', {
      name: data.name
    }, (r) => {
      if(r.length){
        reply(Data.format('', '该用户名已被使用', 502));
        return;
      }
      data.password = md5(data.password);
      Service.save('manage-user', '', data, () => {
        delete data.name;
        ApiUtil.pageQueryPerDay(data, reply, 'doUserAdd', 'manage-user', {}, {}, true);
      }, function(err){
        err && reply(Data.format('', '添加失败'));
      });
    }, function(err){
      err && reply(Data.format('', '添加失败'));
    });
  },

  getRoles(state, reply){
    Service.find('manage-role', '', {}, (arr) => {
      reply(Data.format(arr));
    });
  },
  getUsers(data, reply){
    data.name = '';
    ApiUtil.pageQueryPerDay(data, reply, 'getUsers', `manage-user`, {}, {}, true);
  }
}
