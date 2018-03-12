var path = require('path');
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
