const Data = require('../../utils/data.js');
var Service = require('@flyme/skynet-db');
const LogUtil = require('@flyme/skynet-utils/lib/logUtil.js');
const SessionUtil = require('@flyme/skynet-utils/lib/sessionUtil.js');



module.exports = {
  dealProject(data, name, state, reply, request){
    switch(name){
      case 'doProjectDelete':
        this.doProjectDelete(data, reply, request);
        break;
      case 'doProjectEdit':
        this.doProjectEdit(data, reply, request);
        break;
    }
  },
  doProjectDelete(data, reply, request){
    LogUtil.log('doProjectDelete, id:', data.id, 'username:', SessionUtil.getByRequest(request).name, ' time:', new Date().toString());
    Service.findByIdAndRemove('manage-projects', '', data.id, function(){
      reply(Data.format({}, '删除项目成功'));
    }, function(err){
      if(err){
        reply(Data.format({}, '删除项目失败'));
        LogUtil.error(`projectName: manage-projects,  time: ${new Date().toString()},  doProjectDelete err: ${err.message}`);
        return;
      }
    });
  },
  doProjectEdit(data, reply, request){
    var con = {_id: data.id};
    delete data.id;
    Service.findOneAndUpdate('manage-projects', '', data, con, function(){
      reply(Data.format({}, '修改项目成功'));
    }, function(err){
      if(err){
        reply(Data.format({}, '修改项目失败'));
        LogUtil.error(`projectName: manage-projects,  time: ${new Date().toString()},  doProjectEdit err: ${err.message}`);
        return;
      }
    });
  }
}
