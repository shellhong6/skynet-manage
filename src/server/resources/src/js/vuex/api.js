import Config from '../config';
import * as types from './mutation-types';

export const ajaxOpts = opts => {
  opts.url.indexOf('http') !== 0 && (opts.url = Config.host + opts.url);

  let defaults = {
    method: 'GET',
    crossDomain: true,
    xhrFields: {
      withCredentials: true
    },
  };

  if (opts.data && typeof opts.data != 'function') {
    opts.data = $.param(opts.data, true);
  }

  return $.extend({}, defaults, opts);
};

export const ajax = opts => {
  return $.ajax(ajaxOpts(opts));
};

export const get = opts => {
  opts.method = 'GET';
  return ajax(opts);
};

export const post = opts => {
  opts.method = 'POST';
  return ajax(opts);
};

export const fetch = (dispatch, opts, cb, full = false, extend = []) => {
  if (dispatch == null) dispatch = function() {};

  let beginMutation = '';
  let failedMutation = '';

  if (Array.isArray(cb)) {
    [beginMutation, cb, failedMutation] = cb;
  }

  if (beginMutation) {
    dispatch.apply(dispatch, [].concat([beginMutation], extend));
  }

  extend.push($.extend({},opts)); // 存储opts,请求返回后，可能会根据请求数据不同，数据格式不一样 -- by klj

  return ajax(opts).done(function(res, type, xhr) {
    try {
      if (typeof res == 'string') {
        res = JSON.parse(res);
      }
    } catch (err) {
      res = {
        code: 100,
        message: res
      }
      console.warn('转换返回值出错', opts.url, res);
    }

    if (res.code == 200) {
      if (full) {
        cb(null, res);
      } else {
        if (typeof cb == 'string') {
          dispatch.apply(dispatch, [].concat([cb, res.value], extend));
        } else {
          cb(null, res.value, extend);
        }
      }
    } else {
      if (failedMutation) {
        dispatch.apply(dispatch, [].concat([failedMutation], extend));
      }

      console.warn('接口出错', opts.url, res);
      if (full) {
        cb('interface', res);
      } else {
        dispatch(types.SERVER_ERROR, res, opts);
      }
    }
  }).fail(function(xhr, status) {
    if (failedMutation) {
      dispatch.apply(dispatch, [].concat([failedMutation], extend));
    }

    console.warn('访问接口报错', opts.url, status, xhr);
    if (full) {
      cb('server', xhr, status);
    } else {
      dispatch(types.FETCH_ERROR, xhr, opts);
    }
  });;
};
