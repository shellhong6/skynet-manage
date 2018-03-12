var service = require('@flyme/skynet-db')
var md5 = require('md5');

var password = md5('appadmin111');

service.find('manage-user', '', {
  name: 'appadmin',
  password: password
}, function(arr){
  console.log('arr----', arr);
});
