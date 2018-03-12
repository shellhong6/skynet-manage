var koa = require('koa');
var serve = require('koa-static');
var router = require('koa-router')();
var path = require('path');

var app = koa();


router.get('/console/stat/day', function *(next) {
  var data = [];
  for (var i = 0; i < 20; i++) {
    data.push(  {
        stat_date: '2016-05-21',
        cost: 214 + i,
        cost_rate: 234 + i,
        exposure: 5675 + i,
        exposure_device: 456 + i,
        download: 2341 + i,
        expo_download_rate: 2346546 + i,
        unit_price: 65465 + i,
        ECPM: 4 + i,
      });
  }
  this.body = {
    "code": 200,
    "message": "",
    "redirect": "",
    "value": {
      data: data,
      total: 134
    }
  }
});

router.get('/console/stat', function*(next) {
  var data = [];
  for (var i = 0; i < 20; i++) {
    data.push(  {
        date: '2016-05-21',
        cost: 214 + i,
        consume: 234 + i,
        exposure_count: 5675 + i,
        exposure_number: 456 + i,
        download_number: 2341 + i,
        download_cost: 2346546 + i,
        download_exposure: 65465 + i,
        d_value: 4 + i,
        e_cpm: 534 + i
      });
  }
  this.body = {
    "code": 210,
    "message": "",
    "redirect": "",
    "value": data
  }
});


app.use(serve(path.join(__dirname, './output/dev')));

app.use(router.routes());
app.use(router.allowedMethods());


app.listen(9999);
console.log('listening 9999!');
