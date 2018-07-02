import {
  GET_CODE_STATUS,
  GET_DB_LIST,
  GET_CO_LIST,
  DO_AGGREGATE,
  BATCH_CO_LIST,
  BATCH_DB_LIST
} from '../mutation-types';

const state = {
  jscode: {
    content: '',
    link: ''
  },
  dbTableData: [],
  coTableData: [],
  aggregateTableData: [],
  batchDbList: [],
  batchCoList: []
};

const mutations = {
  [GET_CODE_STATUS] (state, value) {
    state.jscode = value;
  },
  [GET_DB_LIST] (state, value) {
    state.dbTableData = value;
  },
  [BATCH_CO_LIST] (state, value) {
    state.batchCoList = value;
  },
  [GET_CO_LIST] (state, value) {
    state.coTableData = value;
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
