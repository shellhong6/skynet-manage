var Service = require('@flyme/skynet-db');
var exec = require('child_process').exec;

// const AUTH_STR = '';
// const HOST_STR = '127.0.0.1:27017';
// const PATH_STR = '/Users/mFront/dbFiles';
const AUTH_STR = ' -u MEIZU_SKYNET -p TJyM9PyHHH\!LpkSC --authenticationDatabase=admin';
const HOST_STR = '10.3.24.122:28028';
const PATH_STR = '/home/guangjie/dbFiles';
const DO_ALL_OP = ['big-', 'job-', 'manage-', 'slow-'];

var app = {
  exeCommand(cmdStr) {
    return new Promise(function(resolve, reject){
      exec(cmdStr, function(err,stdout,stderr){
        if(err) {
          reject();
        } else {
          resolve();
        }
      });
    });
  },
  isInDoAll(name) {
    for(var val of DO_ALL_OP){
      if(name.indexOf(val) == 0){
        return true;
      }
    }
    return false;
  },
  createExportCommand(dbName, collectionName) {
    return `mongoexport --host ${HOST_STR} -d "${dbName}" -c "${collectionName}" -o "${PATH_STR}/${dbName}"${AUTH_STR}`;
  },
  createImportCommand(dbName, collectionName) {
    return `mongoimport --host ${HOST_STR} -d "skynet-db" -c "${dbName}" --file "${PATH_STR}/${dbName}"${AUTH_STR}`;
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
    for(var db of dbList){
      dbName = db.name;
      if(this.isInDoAll(dbName)){
        coList = await this.getCoList(dbName);
        coList = coList.filter(function(item){
          return item != 'system.indexes';
        });
        if(coList && coList.length > 0){
          allOpArr.push([dbName, coList[0]]);
        }
      }
    }
    return allOpArr;
  },
  async done() {
    var relation = await this.getRelation();
    console.log('begin done!');
    var index = 1;
    for(var item of relation){
      await this.exeCommand(this.createExportCommand(item[0], item[1]));
      console.log(`finish export(${index++}\/${relation.length})`, item[0], item[1]);
    }
    index = 1;
    for(var item of relation){
      await this.exeCommand(this.createImportCommand(item[0], item[1]));
      console.log(`finish import(${index++}\/${relation.length})`, item[0], item[1]);
    }
  }
};
module.exports = app;
