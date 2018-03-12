const UglifyJS = require("uglify-js");
var Service = require('@flyme/skynet-db');
const Path = require('path');
const SessionUtil = require('@flyme/skynet-utils/lib/sessionUtil.js');
const LogUtil = require('@flyme/skynet-utils/lib/logUtil.js');
const Data = require('../../utils/data.js');

Service.setOptions('occasional');

module.exports = {
  dealCodeManage(data, name, state, reply, request){
    switch(name){
      case 'getJsCode':
        this.createJsCode(data, reply, request);
        break;
    }
  },
  createJsCode(data, reply, request){
    var projectName = data.projectCode,
        owner = data.owner;
    if(projectName == ''){
      reply(Data.format('', '项目名称不能为空', 500));
      return;
    }
    if(/all@meizu\.com|KF@meizu\.com|flyme@meizu\.com|web@meizu\.com/.test(data.emails)){
      reply(Data.format('', '无权使用此邮箱', 500));
      return;
    }
    data.name = projectName;
    var userInfo = SessionUtil.getByRequest(request);
    LogUtil.log('do createJsCode, projectName:', projectName, 'emails:', data.emails, 'username:', SessionUtil.getByRequest(request).name, ' time:', new Date().toString());
    Service.find('manage-projects', '', {'name': projectName}, (arr) => {
      var one = null;
      if(arr && arr.length){
        one = arr[0];
        if(one.owner == 'anyone' || one.owner == userInfo.name || userInfo.role == 'admin'){
          if(one.emails != data.emails){
            Service.findOneAndUpdate('manage-projects', '', {emails: data.emails}, {_id: one.id}, () => {
              this.returnJsCode('项目标识已存在，邮箱修改成功', projectName, reply);
            }, function(err){
              err && reply(Data.format('', '邮箱修改失败', 500));
            });
          }else{
            this.returnJsCode('项目标识已存在，相关代码生成在下方', projectName, reply);
          }
        }else{
          reply(Data.format('', '项目名称已被使用', 500));
          return;
        }
        // Service.closeConnection('manage-projects', '');//关闭后无法进行后续搜索
      }else{
        if(owner == 'anyone'){
          data.owner = 'anyone';
        }else{
          data.owner = userInfo.name;
        }
        mes = '项目标识入库成功，相关代码生成在下方';
        Service.save(
          'manage-projects',
          '',
          data,
          () => {
            this.returnJsCode(mes, projectName, reply);
          },
          function(){
            // Service.closeConnection('manage-projects', '');
          }
        );
      }
    }, function(err){
      // err && Service.closeConnection('manage-projects', '');
    });
  },
  returnJsCode(mes, projectName, reply){
    reply(
      Data.format({
        link: '',
        content: UglifyJS.minify(Path.resolve(__dirname, '../../../static/app/monitor.js')).code
      }, mes)
    );
  }
}
