var service = require('@flyme/skynet-db')
var bigMemory = require('./bigMemory.js');
var jobMemory = require('./jobMemory.js');
var jobJSError = require('./jobJSError.js');
var jobPage = require('./jobPage.js');
var jobResources = require('./jobResources.js');
var jobTiming = require('./jobTiming.js');
var slowTiming = require('./slowTiming.js');
var role = require('./role.js');
var user = require('./user.js');

var map = {
  'big-memory': bigMemory,
  'slow-timing': slowTiming,
  'job-jsError': jobJSError,
  'job-memory': jobMemory,
  'job-pv': jobPage,
  'job-resources': jobResources,
  'job-timing': jobTiming
};
var base = {
  'manage-role': role,
  'manage-user': user
};

function doFill(){
  var one = null;
  for(var p in map){
    console.log(`begin fill ${p}`);
    one = map[p];
    for(var i = 0, ilen = one.length; i < ilen; i++){
      (function(){
        var type = p, index = i;
        service.save(type, 'project', one[index], () => {
          console.log(type, index);
        });
      })();
    }
  }
}

function doBaseFill(){
  var one = null;
  for(var p in base){
    console.log(`begin doBaseFill ${p}`);
    one = base[p];
    for(var i = 0, ilen = one.length; i < ilen; i++){
      (function(){
        var type = p, index = i;
        service.save(type, '', one[index], () => {
          console.log(type, index);
        });
      })();
    }
  }
}

doFill();
doBaseFill();
