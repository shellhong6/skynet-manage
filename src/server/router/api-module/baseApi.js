const SessionUtil = require('@flyme/skynet-utils/lib/sessionUtil.js');
const Menu = require('../../data/menu.js');
const Data = require('../../utils/data.js');
const AnalysisApi = require('./analysisApi.js');

module.exports = {
  dealBase(data, name, state, reply, request){
    switch(name){
      case 'menu':
        this.getMenu(state, reply, request);
        break;
      case 'doLogout':
        this.doLogout(state, reply, request);
        break;
    }
  },
  getMenu(state, reply, request){
    AnalysisApi.getProjects((result) => {
      var menu = new Menu();
      var userInfo = SessionUtil.getByRequest(request);
      menu.addAnalysis(result.value);
      menu.addCurAnalysis(userInfo);
      menu.addAuth(userInfo);
      menu.addProjectManage(userInfo);
      reply(Data.format(menu.getMenu()));
    }, request);
  },
  doLogout(data, reply, request){
    SessionUtil.deleteByRequest(request);
    reply(Data.format('')).state('session', null);
  }
}
