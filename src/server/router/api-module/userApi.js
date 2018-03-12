const SessionUtil = require('@flyme/skynet-utils/lib/sessionUtil.js');
const Data = require('../../utils/data.js');
const Menu = require('../../data/menu.js');

module.exports = {
  dealUser(data, name, state, reply, request){
    switch(name){
      case 'info':
        this.getUserInfo(state, reply, request);
        break;
    }
  },
  getUserInfo(state, reply, request){
      var menu = new Menu();
      var userInfo = SessionUtil.getByRequest(request);
      reply(Data.format({
        name: userInfo.name
      }));
  }
}
