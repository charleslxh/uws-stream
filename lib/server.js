'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebSocketServer = require('uws').Server;
var WebSocketStream = require('./stream');

var Server = function Server(opts, cb) {
  _classCallCheck(this, Server);

  var server = new WebSocketServer(opts);

  var proxied = false;

  server.on('newListener', function (event) {
    if (!proxied && event === 'stream') {
      proxied = true;
      server.on('connection', function (conn, req) {
        server.emit('stream', new WebSocketStream(conn, opts), req);
      });
    };
  });

  if (cb) {
    server.on('stream', cb);
  }

  return server;
};

module.exports = Server;