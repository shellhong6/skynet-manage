/**
 * 1.慢事件记录
 * 2.页面资源每天汇总
 */
'use strict'
var service = require('@flyme/skynet-db')
class ResourcesDeal{
  constructor(){
    this['daily-resources'] = {};//处理后的docs存储
    this['daily-resources-save'] = 0;//用于save操作计数，为了实现异步的多个save操作完成后，执行对应的操作
    this['daily-resources-count'] = 0;//原数据表扫描的记录数
  }
  transResources(doc, callback){
    var list = JSON.parse(doc.list);
    list.forEach(function(item){
      item._page = doc._page;
      item._reportServerTime = doc._reportServerTime;
      callback && callback(item);
    });
  }
  doSave(allCompleteFn, gtype, type, project, doc){
    var _gtype = `${gtype}-save`;
    this[_gtype]++;
    service.save(type, project, doc, () => {
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
    service.closeConnectionPreDay('resources', project);
    service.closeConnection('job-resources', project);
    service.closeConnection('slow-resources', project);
  }
  recordSlow(doc, project){//慢事件记录
    if(doc.dur > 2000){
      service.save('slow-resources', project, doc);
    }
  }
  finishDeal(project, type, callback){
    var map = this[type], temp = null;
    for(var p in map){
      temp = map[p];
      this.doSave(() => {
        this.doClear(project, type, callback);
      }, type, 'job-resources', project, temp);
    }
  }
  startDeal(doc, project, type){
    // console.log(project, type, this[`${type}-count`]++);
    this.transResources(doc, (item) => {
      this.recordSlow(item, project);
      var key = `${item._page}-${item.name}`,
          temp = null,
          map = this[type];
      if(!map[key]){
        map[key] = {
          amount: 1,
          name: item.name,
          dur: item.dur,
          type: item.type,
          _page: item._page,
          _reportServerTime: item._reportServerTime
        };
      }else{
        temp = map[key];
        temp.amount += 1;
        temp.dur = (item.dur + temp.dur)/2;
      }
    });
  }
}
module.exports = ResourcesDeal;
