import {
  GET_CODE_STATUS,
  GET_DB_LIST,
  DO_AGGREGATE,
  BATCH_DB_LIST
} from '../mutation-types';

const state = {
  jscode: {
    content: '',
    link: ''
  },
  dbTableData: [],
  aggregateTableData: [],
  batchDbList: []
};

const mutations = {
  [GET_CODE_STATUS] (state, value) {
    state.jscode = value;
  },
  [GET_DB_LIST] (state, value) {
    state.dbTableData = value;
  },
  [BATCH_DB_LIST] (state, value) {
    state.batchDbList = value;
  },
  [DO_AGGREGATE] (state, value) {
    state.aggregateTableData = value;
  }
};

export default {
  state,
  mutations
};
