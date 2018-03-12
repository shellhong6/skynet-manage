import {
  FETCH_ERROR,
  FETCH_SUCCESS,
  SERVER_ERROR,
  DISPLAY_ERROR,
  DISPLAY_SUCCESS
} from '../mutation-types';

const state = {
  errors: [],
  success: []
};

const mutations = {
  [FETCH_ERROR] (state, xhr, opts) {
    state.errors.push({
      type: 'fetch',
      message: `接口访问出错:${opts.url}`,
    });
  },
  [FETCH_SUCCESS] (state, mes) {
    state.success.push({
      type: 'fetch',
      message: mes,
    });
  },

  [SERVER_ERROR] (state, res, opts) {
    state.errors.push({
      type: 'server',
      message: res.message || `服务器返回错误: ${opts.url}`,
    });
  },

  [DISPLAY_ERROR] (state, index, info) {
    state.errors.splice(index, 1);
  },

  [DISPLAY_SUCCESS] (state, index, info) {
    state.success.splice(index, 1);
  }
};

export default {
  state,
  mutations
};
