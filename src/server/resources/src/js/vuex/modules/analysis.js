import {
  GET_PROJECTS_STATUS,
  DO_PROJECT_DELETE,
  DO_PROJECT_EDIT,
  GET_TIMELINE_STATUS,
  GET_MEMORY_STATUS,
  GET_RESOURCES_STATUS,
  GET_PV_STATUS,
  GET_JS_ERROR_TABLE_DATA_STATUS,
  GET_SLOW_TIMING_TABLE_DATA_STATUS,
  GET_BIG_MEMORY_TABLE_DATA_STATUS,
  DO_JS_ERROR_SOLVE,
  GET_PAGES
} from '../mutation-types';

const state = {
  category: {
    projects: []
  },
  charts: {
    timeLine: [],
    memory: [],
    resources: [],
    pv: [],
    jsErrorTableData: [],
    slowTimingTableData: [],
    bigMemoryTableData: []
  },
  form: {
    pageData: []
  }
};

const mutations = {
  [GET_PROJECTS_STATUS] (state, value) {
    state.category.projects = value.map(function(item){
      if(!item.emails){
        item.emails = '';
      }
      return item;
    });
  },
  [DO_PROJECT_DELETE] (state, value) {
    state.category.projects = state.category.projects.filter(function(item){
      return item._id != value.id;
    });
  },
  [DO_PROJECT_EDIT] (state, value) {
    state.category.projects = state.category.projects.map(function(item){
      if(value.id == item._id){
        delete value.id;
        return Object.assign(item, value);
      }
      return item;
    });
  },
  [GET_TIMELINE_STATUS] (state, value) {
    state.charts.timeLine = value;
  },
  [GET_MEMORY_STATUS] (state, value) {
    state.charts.memory = value;
  },
  [GET_RESOURCES_STATUS] (state, value) {
    state.charts.resources = value;
  },
  [GET_PV_STATUS] (state, value) {
    state.charts.pv = value;
  },
  [GET_JS_ERROR_TABLE_DATA_STATUS] (state, value) {
    state.charts.jsErrorTableData = value;
  },
  [GET_SLOW_TIMING_TABLE_DATA_STATUS] (state, value) {
    state.charts.slowTimingTableData = value;
  },
  [GET_BIG_MEMORY_TABLE_DATA_STATUS] (state, value) {
    state.charts.bigMemoryTableData = value;
  },
  [DO_JS_ERROR_SOLVE] (state, value) {
    state.charts.jsErrorTableData = value;
  },
  [GET_PAGES] (state, value) {
    value.map(function(item){
      item.key = item._page;
      item.value = item._page;
      return item;
    });
    value.push({
      key: 'all',
      value: 'all'
    });
    state.form.pageData = value;
  }
};

export default {
  state,
  mutations
};
