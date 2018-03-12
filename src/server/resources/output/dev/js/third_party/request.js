var request = {
  alert: alert,//可重载该方法来实现错误提示方式修改
  post: function(opt) {
    opt.type = 'post';
    return this.ajax(opt);
  },
  get: function(opt) {
    opt.type = 'get';
    return this.ajax(opt);
  },
  serilize: function(json) {
    let result = '';
    for (let p in json) {
      if (json.hasOwnProperty(p)) {
        result += `${p}=${json[p]}&`;
      }
    }
    return result.substr(0, result.length - 1);
  },
  ajax: function(opt) {
    let req = new XMLHttpRequest(),
        success = opt.success || function() {},
        complete = opt.complete || function() {},
        error = opt.error || function() {
          alert(arguments[0].mes);
        },
        timeout = opt.timeout || 5e4,
        returnAll = opt.returnAll,
        cache = opt.cache,
        dataType = opt.dataType || 'json',
        data = opt.data || {},
        url = opt.url,
        params = this.serilize(data),
        timeoutHandle = null;
    opt.type === undefined && (opt.type = 'post');
    req.onreadystatechange = () => {
      if (req.readyState != 4) return;
      clearTimeout(timeoutHandle);
      if (req.status != 200 && req.status != 304) {
        error && error({
          req: req,
          mes: '服务不可用'
        });
        complete && complete(req);
        return;
      }
      let rt = req.responseText;
      switch (dataType) {
        case 'json':
          rt = JSON.parse(rt);
          break;
        default:
          ;
      }
      let result = this.getData(rt, returnAll);
      if(result != null){
        success && success(result);
      }
      complete && complete(req);
    };
    if (opt.type == 'get') {
      if (params) {
        params = `?${params}${cache ? '' : '&_' + new Date().getTime()}`;
      } else {
        params = cache ? '' : '?_' + new Date().getTime();
      }
      req.open('GET', `${url}${params}`, true);
    } else {
      req.open('POST', `${url}${cache ? '' : '?_' + new Date().getTime()}`, true);
      req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }
    // req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    req.send(opt.type == 'post' ? params : null);
    if (timeout) {
      timeoutHandle = setTimeout(function() {
        req.onreadystatechange = function() {};
        req.abort();
        error && error({
          req: req,
          mes: '请求超时'
        });
        complete && complete(req);
      }, timeout);
    }
    return req;
  },
  getData: function(data, returnAll) {
    if (!data) return null;
    if (typeof(data) === 'object') {
      if (data.code != 200) {
        this.alert(data.message || '服务不可用', data);
        return (returnAll && data || null);
      } else {
        return (returnAll && data || data.value);
      }
    }
    return data;
  }
}
