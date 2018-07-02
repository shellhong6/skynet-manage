var path = require('path');
var DbOperate = require('../utils/db-operate');
const PREFIX = '../resources/output/dev';

const getPath = function(url){
  return path.resolve(__dirname, `${PREFIX}${url}`);
};
module.exports = {
  init: function(server){
    server.register(require('inert'), (err) => {
        if (err) {
            throw err;
        }
        server.route({
          method: 'GET',
          path: '/index',
          config: {
            auth: 'default',
            handler: function(request, reply) {
              reply.file(getPath(`/views/index.html`));
            }
          }
        });
        // server.route({
        //   method: 'GET',
        //   path: '/login',
        //   config: {
        //     auth: 'default',
        //     handler: function(request, reply) {
        //       var html = `<!DOCTYPE html>
        //                   <html lang="en">
        //                   <head>
        //                     <meta charset="UTF-8">
        //                     <title>平台升级提醒</title>
        //                   </head>
        //                   <body>
        //                     <h1>平台正在进行重大升级，请稍后回来！</h1>
        //                     <div>
        //                       数据库迁移：${DbOperate.isFinishMove}
        //                     </div>
        //                     <div>
        //                       数据库融合：${DbOperate.isFinishMerge}
        //                     </div>
        //                   </body>
        //                   </html>
        //                 `;
        //       var response = reply.response(html);
        //       response.header('Content-Type', 'text/html');
        //       return response;
        //     }
        //   }
        // });
        server.route({
          method: 'GET',
          path: '/login',
          config: {
            auth: 'default',
            handler: function(request, reply) {
              reply.file(getPath(`/views/login.html`));
            }
          }
        });
        server.route({
          method: 'GET',
          path: '/js/{p*}',
          config: {
            auth: 'default',
            handler: function(request, reply) {
              reply.file(getPath(`/js/${request.params.p}`));
            }
          }
        });
        server.route({
          method: 'GET',
          path: '/css/{p*}',
          config: {
            auth: 'default',
            handler: function(request, reply) {
              reply.file(getPath(`/css/${request.params.p}`));
            }
          }
        });
        server.route({
          method: 'GET',
          path: '/fonts/{p*}',
          config: {
            auth: 'default',
            handler: function(request, reply) {
              reply.file(getPath(`/fonts/${request.params.p}`));
            }
          }
        });
        server.route({
          method: 'GET',
          path: '/images/{p*}',
          config: {
            auth: 'default',
            handler: function(request, reply) {
              reply.file(getPath(`/images/${request.params.p}`));
            }
          }
        });
    });
  }
}
