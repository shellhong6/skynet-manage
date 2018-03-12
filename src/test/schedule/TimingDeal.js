/**
 * 1.记录慢事件
 * 2.累加
 * 3.页面小时pv
 * 4.页面小时timeline
 */
'use strict'
var service = require('@flyme/skynet-db')
class TimingDeal{
  constructor(){
    this['daily-timing'] = {};//处理后的docs存储
    this['daily-timing-save'] = 0;//用于save操作计数，为了实现异步的多个save操作完成后，执行对应的操作
    this['daily-timing-count'] = 0;//原数据表扫描的记录数
    this['slow-timing-count'] = 0;
    this['all-page'] = {};//页面统计
  }
  recordSlow(doc, project){//慢事件记录
    if(doc.le - doc.ns > 5000 || doc.end - doc.ns > 5000){
      delete doc._id;
      delete doc.__v;
      service.save('slow-timing', project, doc);
      this['slow-timing-count']++;
    }
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
  finishDeal(project, type, callback){
    var map = this[type], temp = null, one = null, page = null;
    for(var p in map){
      temp = map[p];
      this.doSave(() => {//页面小时pv
        this.doClear(project, type, callback);
      }, type, 'job-pv', project, temp);
      page = temp._page;
      one = temp.doc;
      one._page = page;
      this['all-page'][`${page}_${project}`] = {
        'project': project,
        '_page': page
      };
      one._reportServerTime = temp._reportServerTime;
      this.doSave(() => {//页面小时timeline
        if(type == 'daily-timing'){
          service.findOneAndUpdate('manage-projects', '', {
            slowTimingAmount: this['slow-timing-count']
          }, {
            name: project
          }, () => {
            console.log('manage-projects：set slowTimingAmount to', this['slow-timing-count']);
          }, function(){
            service.closeConnection('manage-projects', '');
          });
        }
        this.doClear(project, type, callback);
      }, type, 'job-timing', project, one);
    }
    for(var p in this['all-page']){
      service.find('job-all-page', '', this['all-page'][p], () => {
        this.doSave(() => {//页面统计
          this.doClear(project, type, callback);
        }, type, 'job-all-page', '', this['all-page'][p]);
      }, (err) => {
        if(err){
          throw new Error(`db: job-all-page,  time: ${new Date().toString()},  action: find, err: ${err.message}`);
        }
      });
    }
  }
  closeDb(project){
    service.closeConnectionPreDay('timing', project);
    service.closeConnection('job-pv', project);
    service.closeConnection('job-all-page', '');
    service.closeConnection('job-timing', project);
    service.closeConnection('slow-timing', project);
  }
  startDeal(doc, project, type){
    var key = `${doc._page}-${new Date(doc._reportServerTime).getHours()}`,
        _doc = doc._doc,
        temp = null,
        map = this[type],
        rs = doc['fs'] - doc['ns'],
        net = doc['rese'] - doc['dls'],
        load = doc['le'] - doc['rese'],
        other = doc['end'] ? (doc['end'] - doc['le']) : 0;
    _doc.readyStart = rs;
    _doc.net = net;
    _doc.load = load;
    _doc.other = other;
    this.recordSlow(_doc, project);
    if(!map[key]){
      map[key] = {
        amount: 1,
        _page: _doc._page,
        _reportServerTime: doc._reportServerTime,
        doc: {
          readyStart: rs,
          net: net,
          load: load,
          other: other
        }
      };
    }else{
      temp = map[key].doc;
      map[key].amount += 1;
      temp['readyStart'] = (temp['readyStart'] + rs)/2;
      temp['net'] = (temp['net'] + net)/2;
      temp['load'] = (temp['load'] + load)/2;
      temp['other'] = (temp['other'] + other)/2;
    }
  }
}
module.exports = TimingDeal;
