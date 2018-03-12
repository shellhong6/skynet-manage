var util = {
  getTime: function(hour){
    var d = new Date();
    d.setHours(hour - 24);
    return d.getTime();
  },
  getRandom: function(start, end){
    return Math.floor(Math.random() * end) + start;
  }
};
module.exports = util;
