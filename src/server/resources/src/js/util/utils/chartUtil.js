import BaseUtil from './baseUtil.js'
const perDay = 864e5;
export default {
  bgcolors: [
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 99, 132, 0.2)',
  ],
  getRange: function(data){
    var min = data[0]._reportServerTime, max = 0;
    data.forEach((item) => {
      min = Math.min(min, item._reportServerTime);
      max = Math.max(max, item._reportServerTime);
    });
    return [max, min];
  },
  justRange: function(range){
    var r = range[0] - range[1];
    if(r <= perDay){
      return 'one_day';
    }
    if(r <= perDay * 3){
      return 'three_day';
    }
    if(r <= perDay * 30){
      return 'one_month';
    }
    if(r <= perDay * 356){
      return 'one_year';
    }
    return 'other';
  },
  transDataWithTime: function(data, filter, format, type, isCumulate){
    var range = this.getRange(data);
    var r = this.transDataWithTimeBase(data, filter, format, type, this.justRange(range), isCumulate);
    return {
      data: r,
      range: range
    }
  },
  timeFormat: function(time, style){
    var date = BaseUtil.formatTime(time, 'yyyy-MM-dd');
    switch (style) {
      case 'one_day':
        return BaseUtil.formatTime(time, 'hhH');
      case 'three_day':
        var hour = new Date(time).getHours();
        return `${date} ${1 + 3 * parseInt(hour / 3)}H`;
      case 'one_month':
        var date = new Date(time);
        var dateNum = date.getDate();
        dateNum = 1 + 2 * parseInt(dateNum / 2);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${dateNum}`;
      case 'one_year':
        return `${new Date(time).getMonth() + 1}月`;
      case 'other':
        return `${new Date(time).getFullYear()}年`;
    }
  },
  transDataWithTimeBase: function(data, filter, format, type, style, isCumulate){
    var map = {}, datasets = [], time = 0, labels = [], bg = [], i = 0, temp = {}, p = null, one = null;
    data.forEach((item) => {
      time = this.timeFormat(item._reportServerTime, style);
      if(labels.indexOf(time) == -1){
        labels.push(time);
      }
      for(p in item){
        if(filter.indexOf(p) == -1){
          continue;
        }
        if(!temp[p]){
          temp[p] = {};
        }
        if(temp[p][time]){
          temp[p][time] = temp[p][time] + parseFloat(item[p]);
          if(isCumulate !== true){
            temp[p][time] /= 2;
          }
        }else{
          temp[p][time] = parseFloat(item[p]);
        }
      }
    });
    for(p in temp){
      one = temp[p];
      for(var t in temp[p]){
        if(!map[p]){
          map[p] = {
            type: type,
            label: p,
            fill: true,
            backgroundColor: this.bgcolors[i++],
            data: [one[t]]
          };
        }else{
          map[p].data.push(one[t]);
        }
      }
    }
    for(p in map){
      datasets.push(map[p]);
    }
    var r = {
      labels: labels,
      datasets: datasets,
    };
    return r;
  },
  transResourcesDataWithDomain: function(data, type, precision){
    var map = {}, labels = [], name = null, durData = [], amountData = [], domain = '', one = null;
    data.forEach((item) => {
      name = item.name.match(/\:\/\/([^:/]+)/);
      if(name && name.length > 1){
        domain = name[1];
      }
      if(!map[domain]){
        map[domain] = {
          dur: item.amount * item.dur,
          amount: item.amount
        };
      }else{
        map[domain].dur += item.amount * item.dur;
        map[domain].amount += item.amount;
      }
    });
    for(var rp in map){
      one = map[rp];
      durData.push(BaseUtil.toSecond(one.dur));
      amountData.push(one.amount);
      labels.push(rp);
    }
    var r = {
      labels: labels,
      datasets: [{
        type: type,
        label: '时间占比',
        backgroundColor: this.bgcolors[0],
        data: durData
      },{
        type: type,
        label: '次数占比',
        backgroundColor: this.bgcolors[1],
        data: amountData
      }],
    };
    return r;
  },
  transResourcesDataWithType: function(data, type, precision){
    var map = {}, labels = [], rtype = null, rdata = [];
    data.forEach((item) => {
      rtype = item.type;
      if(!map[rtype]){
        map[rtype] = item.amount * item.dur;
      }else{
        map[rtype] += item.amount * item.dur;
      }
    });
    for(var rp in map){
      rdata.push(BaseUtil.toSecond(map[rp]));
      labels.push(rp);
    }
    var r = {
      labels: labels,
      datasets: [{
        type: type,
        backgroundColor: this.bgcolors[0],
        data: rdata
      }],
    };
    return r;
  }
};
