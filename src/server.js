'use strict';

const WebSocketServer = require('uws').Server;
const WebSocketStream = require('./stream');

class Server {
  constructor(opts, cb) {
    const server = new WebSocketServer(opts);

    let proxied = false;

    server.on('newListener', (event) => {
      if (!proxied && event === 'stream') {
        proxied = true;
        server.on('connection', (conn, req) => {
          server.emit('stream', new WebSocketStream(conn, opts), req)
        });
      };
    });

    if (cb) {
      server.on('stream', cb);
    }

    return server;
  }
}

module.exports = Server;
