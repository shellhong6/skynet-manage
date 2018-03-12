export default {
  perDay: 864e5,
  getUrlParam(name) {
    var pattern = new RegExp("[?&]" + name + "\=([^&]+)", "g");
    var matcher = pattern.exec(location.href);
    var items = null;
    if (null != matcher) {
      try {
        items = decodeURIComponent(decodeURIComponent(matcher[1]));
      } catch (e) {
        try {
          items = decodeURIComponent(matcher[1]);
        } catch (e) {
          items = matcher[1];
        }
      }
    }
    return items;
  },
  toSecond: function(ms, precision){
    return `${(ms / 1000).toFixed(precision || 1)}`;
  },
  toMinute: function(ms, precision){
    return `${(ms / 1000 / 60).toFixed(precision || 1)}`;
  },
  formatSizeAuto: function(value){
    if (value < 999) {
        return value;
      } else if (value < 1e5) {
        let v = new String(value),
          l = v.length;
        return `${v.substr(0, l - 3)},${v.substr(l - 3)}`;
      } else if (value >= 1e5 && value < 1e8) { //十万到一亿
        return (value / 1e4).toFixed(0) + '万';
      } else {
        return (value / 1e8).toFixed(0) + '亿';
      }
  },
  formatSize: function(size, type, precision){
    var r = size;
    switch (type.toLowerCase()) {
      case 'g':
        r = r / 1024;
      case 'mb':
        r = r / 1024;
      case 'kb':
        r = r / 1024;
      default:;
    }
    return r.toFixed(precision || 1);
  },
  autoFormatSize: function(size){
    if(size > 1073741824){
      return this.formatSize(size, 'g') + 'G';
    }
    if(size > 1048576){
      return this.formatSize(size, 'mb') + 'MB';
    }
    if(size > 1024){
      return this.formatSize(size, 'kb') + "KB";
    }
    return size + 'B';
  },
  formatTime: function(time, format){
    var date = new Date(time);
    var o = {
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "h+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds()
    };
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      }
    }
    if (/(w+)/.test(format)) {
      format = format.replace(RegExp.$1, this.getWeek(date));
    }
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    return format;
  }
};
