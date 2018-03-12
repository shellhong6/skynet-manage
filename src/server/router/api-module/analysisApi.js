const Data = require('../../utils/data.js');
const SessionUtil = require('@flyme/skynet-utils/lib/sessionUtil.js');
var Service = require('@flyme/skynet-db');
const ChartUtil = require('../../utils/chart.js');
const BaseUtil = require('@flyme/skynet-utils/lib/baseUtil.js');
const ApiUtil = require('./util.js');
const LogUtil = require('@flyme/skynet-utils/lib/logUtil.js');

Service.setOptions('occasional');

module.exports = {
  dealAnalysis(data, name, state, reply, request){
    switch(name){
      case 'getProjects':
        this.getProjects(reply, request);
        break;
      case 'getTimeLine':
        this.getTimeLine(data, reply);
        break;
      case 'getMemory':
        this.getMemory(data, reply);
        break;
      case 'getResources':
        this.getResources(data, reply);
        break;
      case 'getPv':
        this.getPv(data, reply);
        break;
      case 'getJsErrorTableData':
        this.getJsErrorTableData(data, reply);
        break;
      case 'getSlowTimingTableData':
        this.getSlowTimingTableData(data, reply);
        break;
      case 'getBigMemoryTableData':
        this.getBigMemoryTableData(data, reply);
        break;
      case 'doJsErrorSolve':
        this.doJsErrorSolve(data, reply);
        break;
      case 'getPages':
        this.getPages(data, reply);
        break;
    }
  },
  getProjects(reply, request){
    var userInfo = SessionUtil.getByRequest(request);
    var callback = function (err, docs) {
      if(err){
        reply(Data.format({}, '获取项目失败'));
        LogUtil.error(`projectName: ${data.name},  time: ${new Date().toString()},  getProjects err: ${err.message}`);
        return;
      }
      reply(Data.format(docs));
    };
    var query = Service.find('manage-projects', '', {});
    if(userInfo.role.indexOf('admin') != -1 || userInfo.role.indexOf('vip') != -1){//超级管理员
      query.exec(callback);
    }else{
      query.where('owner').in([userInfo.name, 'anyone']).exec(callback);
    }
  },
  getTimeLine(data, reply){
    this.getJobPreDay(data, reply, 'getTimeLine', `job-timing`);
  },
  getJsErrorTableData(data, reply){
    ApiUtil.pageQueryPerDay(data, reply, 'getJsErrorTableData', `job-jsError`, this.getAnalysisQueryCon({solve: false}, data), {}, true);
  },
  getBigMemoryTableData(data, reply){
    ApiUtil.pageQueryPerDay(data, reply, 'getBigMemoryTableData', `big-memory`, this.getAnalysisQueryCon({}, data), {});
  },
  getSlowTimingTableData(data, reply){
    ApiUtil.pageQueryPerDay(data, reply, 'getSlowTimingTableData', `slow-timing`, this.getAnalysisQueryCon({}, data), {});
  },
  getPv(data, reply){
    this.getJobPreDay(data, reply, 'getPv', `job-pv`);
  },
  getResources(data, reply){
    this.getJobPreDay(data, reply, 'getResources', `job-resources`);
  },
  getMemory(data, reply){
    this.getJobPreDay(data, reply, 'getMemory', `job-memory`);
  },
  doJsErrorSolve(data, reply){
    Service.findOneAndUpdate('job-jsError', data.name, {solve: true}, {_id: data.id}, () => {
      ApiUtil.pageQueryPerDay(data, reply, 'doJsErrorSolve', `job-jsError`, {solve: false}, {}, true);
    }, function(err){
      err && reply(Data.format('', '设置失败'));
    });
  },
  getPages(data, reply){
    Service.find('job-all-page', '', {
      project: data.name
    }, (r) => {
      reply(Data.format(r));
    }, function(err){
      err && reply(Data.format('', '查找所属页面失败'));
    });
  },
  getJobPreDay(data, reply, fnName, type){
    var fresult = Service.find(type, data.name, this.getAnalysisQueryCon({}, data));
    fresult.where('_reportServerTime').gt(data.query_start).lt(data.query_end).exec(function (err, docs) {
      if(err){
        reply(Data.format({}, mes));
        LogUtil.error(`projectName: ${data.name},  time: ${new Date().toString()},  ${fnName} err: ${err.message}`);
        return;
      }
      type = type.replace('job-', '');
      var r = null;
      if(docs && docs.length){
        switch (type) {
          case 'pv':
            r = ChartUtil.transDataWithTime(docs, type, 'bar', true);
            break;
          case 'timing':
            docs.map(function(item){
              item.readyStart = BaseUtil.toSecond(item.readyStart, 2);
              item.net = BaseUtil.toSecond(item.net, 2);
              item.load = BaseUtil.toSecond(item.load, 2);
              item.other = BaseUtil.toSecond(item.other, 2);
              return item;
            });
            r = ChartUtil.transDataWithTime(docs, type, 'line');
            break;
          case 'memory':
            docs.map(function(item){
              item.used = BaseUtil.formatSize(item.used, 'MB', 2);
              item.total = BaseUtil.formatSize(item.total, 'MB', 2);
              item.limit = BaseUtil.formatSize(item.limit, 'MB', 2);
              return item;
            });
            r = ChartUtil.transDataWithTime(docs, type, 'line');
            break;
          case 'resources':
            r = {};
            r.type = ChartUtil.transResourcesDataWithType(docs, 'bar');
            r.domain = ChartUtil.transResourcesDataWithDomain(docs, 'bar');
            break;
        }
      }
      reply(Data.format(r));
    });
  },
  getAnalysisQueryCon(conditions, data){
    if(data.query_page != 'all'){
      conditions._page = data.query_page;
    }
    return conditions;
  }
}
