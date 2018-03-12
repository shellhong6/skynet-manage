var Service = require('@flyme/skynet-db')

Service.find('job-resources', 'appStore-welfare', {'$lt':1}, function(){
  console.log('arguments--', arguments)
});
