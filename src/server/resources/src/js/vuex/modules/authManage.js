import {
  GET_USER_DATA,
  GET_ROLE_DATA,
  DO_USER_DELETE,
  DO_USER_ADD
} from '../mutation-types';

const state = {
  user: {
    userTableData: {}
  },
  role: {
    roleTableData: []
  }
};

const mutations = {
  [GET_USER_DATA] (state, value) {
    state.user.userTableData = value;
  },
  [DO_USER_DELETE] (state, value) {
    state.user.userTableData = value;
  },
  [DO_USER_ADD] (state, value) {
    state.user.userTableData = value;
  },
  [GET_ROLE_DATA] (state, value) {
    state.role.roleTableData = value;
  }
};

export default {
  state,
  mutations
};
