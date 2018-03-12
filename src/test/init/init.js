var service = require('@flyme/skynet-db')

var role = require('./role.js');
var user = require('./user.js');

var base = {
  'manage-role': role,
  'manage-user': user
};


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

doBaseFill();
