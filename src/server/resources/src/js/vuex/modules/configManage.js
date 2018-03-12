import {
  GET_CONFIG_DATA,
  DO_CONFIG_DELETE,
  DO_CONFIG_ADD
} from '../mutation-types';

const state = {
  config: {
    configTableData: {}
  }
};

const mutations = {
  [GET_CONFIG_DATA] (state, value) {
    state.config.configTableData = value;
  },
  [DO_CONFIG_DELETE] (state, value) {
    state.config.configTableData = value;
  },
  [DO_CONFIG_ADD] (state, value) {
    state.config.configTableData = value;
  }
};

export default {
  state,
  mutations
};
