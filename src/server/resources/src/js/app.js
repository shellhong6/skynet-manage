import Vue from 'vue';
import Router from 'vue-router';
import Resource from 'vue-resource';
import Cookies from 'js-cookie';

import Config from './config';

import App from './containers/App.vue';



import Account from './account';

/**
 * 全局
 */
import Blank from './components/Blank.vue';

/**
 * 基础设置
 */
import CodeGenerator from './components/CodeGenerator.vue';
/**
 * 数据分析相关
 */
import ProjectCategory from './components/ProjectCategory.vue';
import ProjectItem0 from './components/ProjectItem0.vue';
import ProjectItem1 from './components/ProjectItem1.vue';
/**
 * 账号管理
 */
import userManage from './components/userManage.vue';
import projectManage from './components/projectManage.vue';
import dbManage from './components/dbManage.vue';
import aggregateManage from './components/aggregateManage.vue';
import configManage from './components/configManage.vue';

var projectItemIndex = 0;

//检查是否登录
Account.checkLogin();

Vue.use(Router);
Vue.use(Resource);

var router = new Router({
  hashbang: false
});

router.map({
    '/': {
      component: Blank,
    },
    '/code-generator': {//代码生成
        component: CodeGenerator
    },
    '/project-category': {//项目大纲
        component: ProjectCategory
    },
    '/project-item-0': {//单个项目数据
        component: ProjectItem0
    },
    '/project-item-1': {//单个项目数据
        component: ProjectItem1
    },
    '/user_manage': {//单个项目数据
        component: userManage
    },
    '/project-manage': {//单个项目数据
        component: projectManage
    },
    '/db-manage': {//单个项目数据
        component: dbManage
    },
    '/aggregate-manage': {//单个项目数据
        component: aggregateManage
    },
    '/config-manage': {//单个项目数据
        component: configManage
    }
});

//登录验证
router.beforeEach(function() {
  Account.checkLogin();
  var r = arguments[0];
  if(r && r.from.path && r.from.path.indexOf('/project-item') != -1 && r.to.path && r.to.path.indexOf('/project-item') != -1){
    var fromIndex = r.from.path.match(/\/project\-item\-([01])(\?.*)/)[1],
        toIndex = r && r.to && r.to.path.match(/\/project\-item\-([01])(\?.*)/)[1];
    if(fromIndex == toIndex){
      r.redirect(`/project-item-${(parseInt(toIndex) + 1) % 2}`);
    }
  }
});

router.beforeEach(function () {
  window.scrollTo(0, 0)
});

router.redirect({
  '*': '/'
});
router.start(App, '#app');
