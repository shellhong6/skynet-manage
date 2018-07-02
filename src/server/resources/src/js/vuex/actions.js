import * as types from './mutation-types';
import Config from '../config';
import Enums from '../enums';
import { ajax, get, post, fetch } from './api';
import Util from '../util/utils/baseUtil';

export const getTreeView = ({ dispatch }) => {
  fetch(dispatch, {
    method: 'POST',
    url: '/api/base/menu'
  }, types.GET_TREEVIEW);
};
const isErr = (err, res, dispatch, url) => {
  if(err && res.code == 302){
    location.href = res.redirect;
    return false;
  }
  if (err || res.code != 200) {
    dispatch(types.SERVER_ERROR, res, {
      url: url
    });
    return true;
  }
  return false;
};
const dispatchSuccess = (mes, dispatch) => {
  mes && dispatch(types.FETCH_SUCCESS, mes);
};
export const displayError = ({ dispatch }, index, info) => {
  dispatch(types.DISPLAY_ERROR, index, info);
};

export const displaySuccess = ({ dispatch }, index, info) => {
  dispatch(types.DISPLAY_SUCCESS, index, info);
};

export const getUserInfo = ({ dispatch }) => {
  var url = '/api/user/info';
  fetch(dispatch, {
    method: 'POST',
    url: url,
  }, (err, res) => {
    if (!isErr(err, res, dispatch, url)) {
      dispatch(types.GET_USER_INFO, res.value);
      dispatchSuccess(res.message, dispatch);
    }
  }, true);
};
export const doLogout = ({ dispatch }) => {
  var url = '/api/base/doLogout';
  fetch(dispatch, {
    method: 'POST',
    url: url,
  }, (err, res) => {
    if (!isErr(err, res, dispatch, url)) {
      location.href = `/login?useruri=${location.href}`
    }
  }, true);
};
export const getCode = ({ dispatch }, data) => {
  var url = '/api/code-manage/getJsCode';
  fetch(dispatch, {
    method: 'POST',
    data,
    url: url
  }, (err, res) => {
    if (!isErr(err, res, dispatch, url)) {
      dispatch(types.GET_CODE_STATUS, res.value);
      dispatchSuccess(res.message, dispatch);
    }
  }, true);
};
export const getProjects = ({ dispatch }, data) => {
  var url = '/api/analysis/getProjects';
  fetch(dispatch, {
    method: 'POST',
    url: url
  }, (err, res) => {
    if (!isErr(err, res, dispatch, url)) {
      dispatch(types.GET_PROJECTS_STATUS, res.value);
      dispatchSuccess(res.message, dispatch);
    }
  }, true);
};
export const getTimeLine = ({ dispatch }, data) => {
  var url = '/api/analysis/getTimeLine';
  fetch(dispatch, {
    method: 'POST',
    data,
    url: url
  }, (err, res) => {
    if (!isErr(err, res, dispatch, url)) {
      dispatch(types.GET_TIMELINE_STATUS, res.value);
      dispatchSuccess(res.message, dispatch);
    }
  }, true);
};

export const getMemory = ({ dispatch }, data) => {
  var url = '/api/analysis/getMemory';
  fetch(dispatch, {
    method: 'POST',
    data,
    url: url
  }, (err, res) => {
    if (!isErr(err, res, dispatch, url)) {
      dispatch(types.GET_MEMORY_STATUS, res.value);
      dispatchSuccess(res.message, dispatch);
    }
  }, true);
};
export const getResources = ({ dispatch }, data) => {
  var url = '/api/analysis/getResources';
  fetch(dispatch, {
    method: 'POST',
    data,
    url: url
  }, (err, res) => {
    if (!isErr(err, res, dispatch, url)) {
      dispatch(types.GET_RESOURCES_STATUS, res.value);
      dispatchSuccess(res.message, dispatch);
    }
  }, true);
};
export const getPv = ({ dispatch }, data) => {
  var url = '/api/analysis/getPv';
  fetch(dispatch, {
    method: 'POST',
    data,
    url: url
  }, (err, res) => {
    if (!isErr(err, res, dispatch, url)) {
      var val = res.value;
      if(val){
        val.amount = val.data.datasets[0].data.reduce(function(acc, val){
          return acc + val;
        }, 0);
      }
      dispatch(types.GET_PV_STATUS, val);
      dispatchSuccess(res.message, dispatch);
    }
  }, true);
};
export const getJsErrorTableData = ({ dispatch }, data) => {
  var url = '/api/analysis/getJsErrorTableData';
  fetch(dispatch, {
    method: 'POST',
    data,
    url: url
  }, (err, res) => {
    if (!isErr(err, res, dispatch, url)) {
      var data = res.value.data;
      data.map(function(item){
        if(!item.stack){
          item.stack = 'unknow';
        }else{
          item.stack = item.stack.replace(/\r\n|\n/g, '<br/>');
        }
        if(!item.message){
          item.message = 'unknow';
        }
        if(!item._reportServerTime){
          item.reportServerTime = ''
        }else{
          item.reportServerTime = Util.formatTime(item._reportServerTime, 'yyyy-MM-dd hh:mm:ss');
        }
        item.amount = Util.formatSizeAuto(item.amount);
        return item;
      });
      res.value.data = data;
      dispatch(types.GET_JS_ERROR_TABLE_DATA_STATUS, res.value);
      dispatchSuccess(res.message, dispatch);
    }
  }, true);
};
export const getSlowTimingTableData = ({ dispatch }, data) => {
  var url = '/api/analysis/getSlowTimingTableData';
  fetch(dispatch, {
    method: 'POST',
    data,
    url: url
  }, (err, res) => {
    if (!isErr(err, res, dispatch, url)) {
      var data = res.value.data;
      data.map(function(item){
        item.readyStart = Util.toSecond(item.readyStart) + 's';
        item.net = Util.toSecond(item.net) + 's';
        item.load = Util.toSecond(item.load) + 's';
        item.other = Util.toSecond(item.other) + 's';
        item._reportServerTime = Util.formatTime(item._reportServerTime, 'yyyy-MM-dd hh:mm:ss');
        return item;
      });
      res.value.data = data;
      dispatch(types.GET_SLOW_TIMING_TABLE_DATA_STATUS, res.value);
      dispatchSuccess(res.message, dispatch);
    }
  }, true);
};
export const getBigMemoryTableData = ({ dispatch }, data) => {
  var url = '/api/analysis/getBigMemoryTableData';
  fetch(dispatch, {
    method: 'POST',
    data,
    url: url
  }, (err, res) => {
    if (!isErr(err, res, dispatch, url)) {
      var data = res.value.data;
      data.map(function(item){
        item.used = Util.formatSize(item.used, 'MB') + 'MB';
        item.total = Util.formatSize(item.total, 'MB') + 'MB';
        item.limit = Util.formatSize(item.limit, 'MB') + 'MB';
        item._reportServerTime = Util.formatTime(item._reportServerTime, 'yyyy-mm-dd hh:MM:ss');
        return item;
      });
      res.value.data = data;
      dispatch(types.GET_BIG_MEMORY_TABLE_DATA_STATUS, res.value);
      dispatchSuccess(res.message, dispatch);
    }
  }, true);
};
export const doJsErrorSolve = ({ dispatch }, data) => {
  var url = '/api/analysis/doJsErrorSolve';
  fetch(dispatch, {
    method: 'POST',
    data,
    url: url
  }, (err, res) => {
    if (!isErr(err, res, dispatch, url)) {
      dispatch(types.DO_JS_ERROR_SOLVE, res.value);
      dispatchSuccess(res.message, dispatch);
    }
  }, true);
};
export const doUserDelete = ({ dispatch }, data) => {
  var url = '/api/auth-manage/doUserDelete';
  fetch(dispatch, {
    method: 'POST',
    data,
    url: url
  }, (err, res) => {
    if (!isErr(err, res, dispatch, url)) {
      dispatch(types.DO_USER_DELETE, res.value);
      dispatchSuccess(res.message, dispatch);
    }
  }, true);
};
export const doConfigDelete = ({ dispatch }, data) => {
  var url = '/api/config-manage/doConfigDelete';
  fetch(dispatch, {
    method: 'POST',
    data,
    url: url
  }, (err, res) => {
    if (!isErr(err, res, dispatch, url)) {
      dispatch(types.DO_CONFIG_DELETE, res.value);
      dispatchSuccess(res.message, dispatch);
    }
  }, true);
};
export const doProjectDelete = ({ dispatch }, data) => {
  var url = '/api/project-manage/doProjectDelete';
  fetch(dispatch, {
    method: 'POST',
    data,
    url: url
  }, (err, res) => {
    if (!isErr(err, res, dispatch, url)) {
      dispatch(types.DO_PROJECT_DELETE, data);
      dispatchSuccess(res.message, dispatch);
    }
  }, true);
};
export const doProjectEdit = ({ dispatch }, data) => {
  var url = '/api/project-manage/doProjectEdit';
  fetch(dispatch, {
    method: 'POST',
    data,
    url: url
  }, (err, res) => {
    if (!isErr(err, res, dispatch, url)) {
      dispatch(types.DO_PROJECT_EDIT, data);
      dispatchSuccess(res.message, dispatch);
    }
  }, true);
};
export const doUserAdd = ({ dispatch }, data) => {
  var url = '/api/auth-manage/doUserAdd';
  fetch(dispatch, {
    method: 'POST',
    data,
    url: url
  }, (err, res) => {
    if (!isErr(err, res, dispatch, url)) {
      dispatch(types.DO_USER_ADD, res.value);
      dispatchSuccess(res.message, dispatch);
    }
  }, true);
};
export const doConfigAdd = ({ dispatch }, data) => {
  var url = '/api/config-manage/doConfigAdd';
  fetch(dispatch, {
    method: 'POST',
    data,
    url: url
  }, (err, res) => {
    if (!isErr(err, res, dispatch, url)) {
      dispatch(types.DO_CONFIG_ADD, res.value);
      dispatchSuccess(res.message, dispatch);
    }
  }, true);
};
export const getUsers = ({ dispatch }, data) => {
  var url = '/api/auth-manage/getUsers';
  fetch(dispatch, {
    method: 'POST',
    data,
    url: url
  }, (err, res) => {
    if (!isErr(err, res, dispatch, url)) {
      dispatch(types.GET_USER_DATA, res.value);
      dispatchSuccess(res.message, dispatch);
    }
  }, true);
};
export const getConfigs = ({ dispatch }, data) => {
  var url = '/api/config-manage/getConfigs';
  fetch(dispatch, {
    method: 'POST',
    data,
    url: url
  }, (err, res) => {
    if (!isErr(err, res, dispatch, url)) {
      dispatch(types.GET_CONFIG_DATA, res.value);
      dispatchSuccess(res.message, dispatch);
    }
  }, true);
};
export const getRoles = ({ dispatch }, data) => {
  var url = '/api/auth-manage/getRoles';
  fetch(dispatch, {
    method: 'POST',
    data,
    url: url
  }, (err, res) => {
    if (!isErr(err, res, dispatch, url)) {
      dispatch(types.GET_ROLE_DATA, res.value);
      dispatchSuccess(res.message, dispatch);
    }
  }, true);
};
export const getPages = ({ dispatch }, data) => {
  var url = '/api/analysis/getPages';
  fetch(dispatch, {
    method: 'POST',
    data,
    url: url
  }, (err, res) => {
    if (!isErr(err, res, dispatch, url)) {
      dispatch(types.GET_PAGES, res.value);
      dispatchSuccess(res.message, dispatch);
    }
  }, true);
};

export const getDbList = ({ dispatch }, data) => {
  var url = '/api/db-manage/getDbList';
  fetch(dispatch, {
    method: 'POST',
    data,
    url: url
  }, (err, res) => {
    if (!isErr(err, res, dispatch, url)) {
      var val = res.value;
      var totalSize = 0;
      val = val.map(function(item){
        totalSize += item.sizeOnDisk;
        item._sizeOnDisk = item.sizeOnDisk;
        item.sizeOnDisk = Util.autoFormatSize(item.sizeOnDisk);
        item.isEmpty = (item.empty ? '是' : '否');
        return item;
      });
      dispatch(types.GET_DB_LIST, {
        data: val,
        length: val.length,
        total: Util.autoFormatSize(totalSize),
        _total: totalSize
      });
      dispatchSuccess(res.message, dispatch);
    }
  }, true);
};
export const getCoList = ({ dispatch }, data) => {
  var url = '/api/co-manage/getCoList';
  fetch(dispatch, {
    method: 'POST',
    data,
    url: url
  }, (err, res) => {
    if (!isErr(err, res, dispatch, url)) {
      var val = res.value;
      dispatch(types.GET_CO_LIST, {
        data: val
      });
      dispatchSuccess(res.message, dispatch);
    }
  }, true);
};
export const getQDbList = ({ dispatch }, data, cb) => {
  var url = '/api/db-manage/getQDbList';
  fetch(dispatch, {
    method: 'POST',
    data,
    url: url
  }, (err, res) => {
    if (!isErr(err, res, dispatch, url)) {
      dispatch(types.BATCH_DB_LIST, {
        data: res.value
      });
      cb && cb(res.value);
    }
  }, true);
};
export const getQCoList = ({ dispatch }, data, cb) => {
  var url = '/api/co-manage/getQCoList';
  fetch(dispatch, {
    method: 'POST',
    data,
    url: url
  }, (err, res) => {
    if (!isErr(err, res, dispatch, url)) {
      dispatch(types.BATCH_CO_LIST, {
        data: res.value
      });
      cb && cb(res.value);
    }
  }, true);
};
export const doDbDelete = ({ dispatch }, data) => {
  var url = '/api/db-manage/doDbDelete';
  fetch(dispatch, {
    method: 'POST',
    data: {dbName: data.entry.name},
    url: url
  }, (err, res) => {
    if (!isErr(err, res, dispatch, url)) {
      var dbTableData = data.dbTableData;
      var entry = data.entry;
      var temp = dbTableData._total - entry._sizeOnDisk;
      dispatch(types.GET_DB_LIST, {
        data: dbTableData.data.filter((item) => {return item.name != entry.name;}),
        length: dbTableData.data.length - 1,
        total: Util.autoFormatSize(temp),
        _total: temp
      });
      dispatchSuccess(res.message, dispatch);
    }
  }, true);
};
export const doCoDelete = ({ dispatch }, data) => {
  var url = '/api/co-manage/doCoDelete';
  fetch(dispatch, {
    method: 'POST',
    data: {name: data.entry.name},
    url: url
  }, (err, res) => {
    if (!isErr(err, res, dispatch, url)) {
      var coTableData = data.coTableData;
      var entry = data.entry;
      dispatch(types.GET_CO_LIST, {
        data: coTableData.data.filter((item) => {return item.name != entry.name;})
      });
      dispatchSuccess(res.message, dispatch);
    }
  }, true);
};
export const batchDbDelete = ({ dispatch }, data) => {
  var url = '/api/db-manage/batchDbDelete';
  fetch(dispatch, {
    method: 'POST',
    data:{query: data.query},
    url: url
  }, (err, res) => {
    if (!isErr(err, res, dispatch, url)) {
      var dbTableData = data.dbTableData,
          temp = 0;
      data.entry.forEach(function(item){
        temp += item.sizeOnDisk;
      });
      temp = dbTableData._total - temp;
      dispatch(types.GET_DB_LIST, {
        data: dbTableData.data.filter((item) => {return data.query.indexOf(item.name) == -1}),
        length: dbTableData.data.length - data.entry.length,
        total: Util.autoFormatSize(temp),
        _total: temp
      });
      dispatchSuccess(res.message, dispatch);
    }
  }, true);
};
export const batchCoDelete = ({ dispatch }, data) => {
  var url = '/api/co-manage/batchCoDelete';
  fetch(dispatch, {
    method: 'POST',
    data:{query: data.query},
    url: url
  }, (err, res) => {
    if (!isErr(err, res, dispatch, url)) {
      var coTableData = data.coTableData;
      dispatch(types.GET_CO_LIST, {
        data: coTableData.data.filter((item) => {return data.query.indexOf(item.name) == -1})
      });
      dispatchSuccess(res.message, dispatch);
    }
  }, true);
};
export const doAggregate = ({ dispatch }, data) => {
  var url = '/api/aggregate-manage/doAggregate';
  fetch(dispatch, {
    method: 'POST',
    data,
    url: url
  }, (err, res) => {
    if (!isErr(err, res, dispatch, url)) {
      dispatch(types.DO_AGGREGATE, res.value);
      dispatchSuccess(res.message, dispatch);
    }
  }, true);
};
export const doAggregateDelete = ({ dispatch }, data) => {
  var url = '/api/aggregate-manage/doAggregateDelete';
  var aggregateTableData = data.aggregateTableData;
  var entry = data.entry;
  var otherInfo = data.otherInfo;
  fetch(dispatch, {
    method: 'POST',
    data: {
      id: entry.id,
      type: otherInfo.type,
      project: otherInfo.project
    },
    url: url
  }, (err, res) => {
    if (!isErr(err, res, dispatch, url)) {
      var aggregateTableData = data.aggregateTableData;
      var entry = data.entry;
      dispatch(types.DO_AGGREGATE, aggregateTableData.filter((item) => {return item.id != entry.id;}));
      dispatchSuccess(res.message, dispatch);
    }
  }, true);
};
