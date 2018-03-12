var schedule = require('node-schedule');
var service = require('@flyme/skynet-db')
var TimingDeal = require('./TimingDeal.js');
var ResourcesDeal = require('./ResourcesDeal.js');
var MemoryDeal = require('./MemoryDeal.js');
var ErrorDeal = require('./ErrorDeal.js');
var mongoose = require('mongoose');
const async = require('async');
const Time = require('@flyme/skynet-utils/lib/timeUtil.js');
const PREFIX = process.argv[2] || 'mongodb://127.0.0.1:27017/';

function _createJob(callback, h){
  schedule.scheduleJob(`0 0 ${h} * * *`, function(){
    callback();
  });
}

function _createSeriesFns(name){
  return [
    _createSeriesFn(name, 'Timing'),
    _createSeriesFn(name, 'Resource'),
    _createSeriesFn(name, 'Memory')
  ];
}

function _createSeriesFn(name, type){
    return (callback) => {
      console.log(`begin dropDaily${type}: `, name);
      dbJob[`dropDaily${type}`](name, function(){
        callback(null, type);
      });
    };
}

var dbJob = {
  log(fn, type){
    console.log(`${fn} ${type}, time: ${new Date()}`);
  },
  doDeal(project, type, obj, fnName){
    var _type = type.replace(/daily-|job-/, '');
    this.log(fnName, 'start');
    service.travelAllPreDay(_type, project, function(doc){
      obj.startDeal(doc, project, type);
    }, () => {
      obj.finishDeal(project, type, (count) => {
        this.log(fnName, 'end, count' + count);
      });
    });
  },
  doDrop(project, type, callback){
    var t = Time.get2DayAgo();
    var url = `${PREFIX}${type}-${project}-${t.getFullYear()}${t.getMonth() + 1}${t.getDate()}`;
    console.log('doDrop connect url ', url);
    mongoose.connect(url,function(){
      try{
        console.log('begin doDrop url: ', url);
        mongoose.connection.db.dropDatabase();
        mongoose.connection.db.close();
      }catch(e){
        console.log('action：doDrop failed', 'url: ', url, 'time：', new Date());
        console.log('error message：', e.message);
      }
      callback && callback();
    });
  },
  doDailyTiming(project){
    this.doDeal(project, 'daily-timing', new TimingDeal(), 'doDailyTiming');
  },
  doDailyResource(project){
    this.doDeal(project, 'daily-resources', new ResourcesDeal(),'doDailyResource');
  },
  doDailyMemory(project){
    this.doDeal(project, 'daily-memory', new MemoryDeal(), 'doDailyMemory');
  },
  doJSError(project){
    this.doDeal(project, 'job-jsError', new ErrorDeal(), 'doJSError');
  },
  dropDailyTiming(project, callback){
    this.doDrop(project, 'timing', callback);
  },
  dropDailyResource(project, callback){
    this.doDrop(project, 'resources', callback);
  },
  dropDailyMemory(project, callback){
    this.doDrop(project, 'memory', callback);
  }
};

_createJob(function(){
  console.log('--begin analysis schedule ', new Date());
  var name = '';
  service.find('manage-projects', '', {}, (r) => {
    r.forEach(function(item){
      name = item.name;
      console.log('--begin analysis ', name, ' ', new Date());
      dbJob.doDailyTiming(name);
      dbJob.doDailyResource(name);
      dbJob.doDailyMemory(name);
      dbJob.doJSError(name);
    });
  }, function(err){
    err && console.log('--analysis schedule error', new Date());
  });
}, 2);

_createJob(function(){
  console.log('--begin dropdb schedule ', new Date());
  var name = '';
  service.find('manage-projects', '', {}, (r) => {
    var fns = [];
    r.forEach(function(item){
      name = item.name;
      fns = fns.concat(_createSeriesFns(name));
    });
    async.series(
      fns,
      function(err, results){}
    );
  }, function(err){
    err && console.log('--dropdb schedule error', new Date());
  });
}, 5);
