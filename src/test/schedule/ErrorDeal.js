/**
 * 1.慢事件记录
 * 2.页面资源每天汇总
 */
'use strict'
var service = require('@flyme/skynet-db')
class ErrorDeal{
  constructor(){
    this['job-jsError'] = {};//处理后的docs存储
    this['job-jsError-save'] = 0;//用于save操作计数，为了实现异步的多个save操作完成后，执行对应的操作
    this['job-jsError-count'] = 0;//原数据表扫描的记录数
  }
  doSave(allCompleteFn, gtype, type, project, doc){
    var _gtype = `${gtype}-save`;
    this[_gtype]++;
    service.save(type, project, doc, () =>{
      this[_gtype]--;
      if(this[_gtype] == 0){
        allCompleteFn && allCompleteFn();
      }
    });
  }
  doClear(project, type, callback){
    this.closeDb(project);
    callback && callback(this[`${type}-count`]);
  }
  closeDb(project){
    service.closeConnectionPreDay('jsError', project);
    service.closeConnection('job-jsError', project);
  }
  finishDeal(project, type, callback){
    var map = this[type], temp = null;
    for(var p in map){
      temp = map[p];
      delete temp._id;
      delete temp.__v;
      this.doSave(() => {
        service.findOneAndUpdate('manage-projects', '', {
          errorAmount: this[`${type}-count`]
        }, {
          name: project
        }, () => {
          console.log('manage-projects：set errorAmount to', this[`${type}-count`]);
        }, function(){
          service.closeConnection('manage-projects', '');
        });
        this.doClear(project, type, callback);
      }, type, 'job-jsError', project, temp);
    }
  }
  startDeal(doc, project, type){
    // console.log(project, type, this[`${type}-count`]++);
    var key = `${doc._page}-${doc.stack}`,
        temp = null,
        map = this[type];
    if(!map[key]){
      map[key] = doc._doc;
    }else{
      temp = map[key];
      temp.amount += 1;
    }
  }
}
module.exports = ErrorDeal;
