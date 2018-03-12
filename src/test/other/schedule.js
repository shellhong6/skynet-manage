var schedule = require('node-schedule');

function createJob(callback){
  schedule.scheduleJob('0 */1 * * * *', function(){
    callback();
  });
}

createJob(function(){
  console.log(new Date());
});
console.log('begin', new Date());
