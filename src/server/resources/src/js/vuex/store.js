import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/logger';

import analysis from './modules/analysis';
import dataManage from './modules/dataManage';
import preferences from './modules/preferences';
import global from './modules/global';
import authManage from './modules/authManage';
import configManage from './modules/configManage';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  strict: false,

  middlewares: debug ? [createLogger()] : [],

  modules: {
    analysis,
    authManage,
    configManage,
    dataManage,
    preferences,
    global
  }
});
