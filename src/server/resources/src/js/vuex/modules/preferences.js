import {
  GET_TREEVIEW,
  GET_USER_INFO,
} from '../mutation-types.js';

const state = {
  tree: [],
  userInfo: {},
};

const mutations = {
  [GET_TREEVIEW] (state, value) {
    state.tree = value;
  },

  [GET_USER_INFO] (state, value) {
    state.userInfo = value;
  }
};

export default {
  state,
  mutations
};
