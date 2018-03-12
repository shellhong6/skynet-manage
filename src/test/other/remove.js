var service = require('@flyme/skynet-db')

service.find('job-all-page', '', {}, (r) => {
  var arr = [], temp = '';
  r.forEach(function(item){
    temp = `${item.project}${item._page}`;
    if(arr.indexOf(temp) == -1){
      arr.push(temp);
    }else{
      console.log('remove: ', temp)
      service.find('job-all-page', '', {
        project: item.project,
        '_page': item._page
      }).remove().exec();
    }
  });
  // console.log('arr------', arr);
}, (err) => {
  if(err){
    throw new Error(`db: job-all-page,  time: ${new Date().toString()},  action: find, err: ${err.message}`);
  }
});
