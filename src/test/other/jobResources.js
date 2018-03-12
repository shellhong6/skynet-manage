var util = require('./util.js');
module.exports = [
  {
    "amount" : util.getRandom(1, 50),
    "name" : "http://mfrontdeimac.local:3000/img/1",
    "dur" : util.getRandom(30, 400),
    "type" : "img",
    "_page" : "http://172.18.39.4:3000/test",
    "_reportServerTime" : util.getTime(0)
  },{
    "amount" : util.getRandom(1, 50),
    "name" : "http://www.baidu.com/link/1",
    "dur" : util.getRandom(30, 400),
    "type" : "link",
    "_page" : "http://172.18.39.4:3000/test",
    "_reportServerTime" : util.getTime(0)
  },{
    "amount" : util.getRandom(1, 50),
    "name" : "http://test.meizu.com:3000/js/1",
    "dur" : util.getRandom(30, 400),
    "type" : "script",
    "_page" : "http://172.18.39.4:3000/test",
    "_reportServerTime" : util.getTime(0)
  },{
    "amount" : util.getRandom(1, 50),
    "name" : "http://mfrontdeimac.local:3000/css/1",
    "dur" : util.getRandom(30, 400),
    "type" : "style",
    "_page" : "http://172.18.39.4:3000/test",
    "_reportServerTime" : util.getTime(0)
  }
];
