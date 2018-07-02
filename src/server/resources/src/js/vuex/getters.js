export const globalErrors = state => {
  return state.global.errors;
};

export const globalSuccess = state => {
  return state.global.success;
};

export const preferencesTreeView = state => {
  return state.preferences.tree;
};


export const userInfo = state => {
  return state.preferences.userInfo;
};

/**
 * 代码生成
 */
export const jsCodeContent = state => {
  return state.dataManage.jscode.content;
};
export const jsCodeLink = state => {
  return state.dataManage.jscode.link;
};

/**
 * 项目大纲
 */
export const projects = state => {
  return state.analysis.category.projects;
};
/**
 * 单个项目的数据表单
 */
export const timeLine = state => {
  return state.analysis.charts.timeLine;
};
export const memory = state => {
  return state.analysis.charts.memory;
};
export const resources = state => {
  return state.analysis.charts.resources;
};
export const pv = state => {
  return state.analysis.charts.pv;
};
export const jsErrorTableData = state => {
  return state.analysis.charts.jsErrorTableData;
};
export const slowTimingTableData = state => {
  return state.analysis.charts.slowTimingTableData;
};
export const bigMemoryTableData = state => {
  return state.analysis.charts.bigMemoryTableData;
};
export const pageData = state => {
  return state.analysis.form.pageData;
};
/*账户管理*/
export const userTableData = state => {
  return state.authManage.user.userTableData;
};
export const roleTableData = state => {
  return state.authManage.role.roleTableData;
};

export const configTableData = state => {
  return state.configManage.config.configTableData || [];
};

export const dbTableData = state => {
  return state.dataManage.dbTableData;
};
export const coTableData = state => {
  return state.dataManage.coTableData;
};
export const aggregateTableData = state => {
  return state.dataManage.aggregateTableData;
};

/*数据库操作*/
export const batchDbList = state => {
  return state.dataManage.dbTableData;
};
export const batchCoList = state => {
  return state.dataManage.batchCoList;
};
