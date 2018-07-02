/**
 * 较大的库，容易卡住
 */
var Service = require('@flyme/skynet-db');
var exec = require('child_process').exec;

const DO_ALL_OP = ['androidReport-', 'jsError-', 'memory-', 'report-', 'resources-', 'timing-'];

var app = {
  isInDoAll(name) {
    for(var val of DO_ALL_OP){
      if(name.indexOf(val) == 0){
        return true;
      }
    }
    return false;
  },
  transformCoName(name) {
    var r = null;
    for(var val of DO_ALL_OP){
      r = name.match(new RegExp(`^${val.toLowerCase()}(.+)`));
      if(r && r.length > 1){
        return [val.substr(0, val.length - 1), r[1]];
      }
    }
    return null;
  },
  transformDbName(name) {
    var r = null;
    for(var val of DO_ALL_OP){
      r = name.match(new RegExp(`^${val}(.+)`));
      if(r && r.length > 1){
        return [val.substr(0, val.length - 1), r[1]];
      }
    }
    return null;
  },
  getDbList() {
    return new Promise(function(resolve, reject){
      Service.getDbList('manage-user', function(err, r){
        if(err){
          reject(err);
        }else{
          resolve(r);
        }
      });
    });
  },
  getCoList(dbName) {
    return new Promise(function(resolve, reject){
      Service.getCoNames(function(err, r){
        if(err){
          reject(err);
        }else{
          resolve(r);
        }
      }, dbName);
    });
  },
  async getRelation() {
    var dbList = await this.getDbList();
    var coList = null;
    var dbName = null;
    var allOpArr = [];
    var transformCoNameResult = null;
    for(var db of dbList){
      dbName = db.name;
      if(this.isInDoAll(dbName)){
        coList = await this.getCoList(dbName);
        coList = coList.filter(function(item){
          return item != 'system.indexes';
        });
        transformCoNameResult = this.transformCoName(coList[0]);
        if(coList && coList.length > 0){
          allOpArr.push([dbName, coList[0], transformCoNameResult]);
        }
      }
    }
    return allOpArr;
  },
  travelAll(dbName, type, project, callback, completeFn) {
    Service.travelAll(type, project, function(data){
      callback && callback(null, data);
    }, function(){
      completeFn && completeFn();
    }, function(q){return q;}, dbName);
  },
  merge(dbName, coName, type, project) {
    return new Promise((resolve, reject) => {
      var transformDbNameResult = null;
      this.travelAll(dbName, type, project, (err, data) => {
        if(!err){
          transformDbNameResult = this.transformDbName(dbName);
          delete data._id;
          delete data._doc._id;
          Service.save(transformDbNameResult[0], transformDbNameResult[1], data._doc, null, function(err){
            err && console.log(err);
          });
        }
      }, function(){
        console.log('finish merge', dbName);
        resolve();
      });
    });
  },
  async done() {
    var relation = await this.getRelation();
    console.log('begin done!');
    var index = 1;
    for(var item of relation){
      await this.merge(item[0], item[1], item[2][0], item[2][1]);
      console.log(`finish merge(${index++}\/${relation.length})`, item[0], item[1]);
    }
  }
};
module.exports = app;
