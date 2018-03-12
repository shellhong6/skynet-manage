'use strict'
const Constant = require('../utils/constant.js');
const AUTH_MENU = {
  title: '账户管理',
  code: 'auth-manage',
  icon: 'fa-male',
  children: [
    {
      title: '账号管理',
      url: '/user_manage',
      icon: '',
    }
  ]
};
const PROJECT_MENU = {
  title: '数据管理',
  code: 'project-manage',
  icon: 'fa-database',
  children: [
    {
      title: '项目管理',
      url: '/project-manage',
      icon: '',
    },
    {
      title: '数据库管理',
      url: '/db-manage',
      icon: '',
    },
    {
      title: 'aggregate管理',
      url: '/aggregate-manage',
      icon: '',
    },
    {
      title: '配置管理',
      url: '/config-manage',
      icon: '',
    }
  ]
};
const CURRENT_ANALYSIS = {
  title: '实时数据',
  code: 'current-analysis',
  url: 'setting',
  icon: 'fa-database',
  children: [
    {
      title: 'xxxx',
      url: '/cxxxxx',
      icon: '',
    }
  ]
};
class Menu{
  constructor(){
    this.base = [
      {
        title: '数据分析',
        code: 'analysis',
        icon: 'fa-pie-chart',
        children: [
          {
            title: '项目大纲',
            url: '/project-category',
            icon: '',
          }
        ]
      },{
        title: '代码管理',
        code: 'code_manage',
        url: '/code-manage',
        icon: 'fa-database',
        children: [
          {
            title: '代码生成',
            url: '/code-generator',
            icon: '',
          }
        ]
      }
    ];
  }
  doExtend(code, list){
    this.base.map(function(item){
      if(item.code == code){
        !item.children && (item.children = []);
        item.children = item.children.concat(list);
      }
      return item;
    });
    return this.base;
  }
  addAnalysis(extend){
    var list = [];
    extend.forEach(function(one){
      list.push({
        title: one.name,
        url: `/project-item-0?name=${one.name}`,
        icon: '',
      });
    });
    return this.doExtend('analysis', list);
  }
  just(userInfo, code){
    return userInfo.role.indexOf('admin') != -1 || Constant.auth[userInfo.role].indexOf(code) != -1;
  }
  addAuth(userInfo){
    if(this.just(userInfo, AUTH_MENU.code)){
      this.base.push(AUTH_MENU);
    }
    return this.base;
  }
  addProjectManage(userInfo){
    if(this.just(userInfo, PROJECT_MENU.code)){
      this.base.push(PROJECT_MENU);
    }
    return this.base;
  }
  addCurAnalysis(userInfo){
    if(this.just(userInfo, CURRENT_ANALYSIS.code)){
      this.base.push(CURRENT_ANALYSIS);
    }
    return this.base;
  }
  getMenu(){
    return this.base;
  }
}

module.exports = Menu;
