'use strict';

const WebSocketServer = require('uws').Server;
const WebSocketStream = require('./stream');

class Server extends WebSocketServer {
  constructor(opts, cb) {
    super(opts);

    let proxied = false;
    this.on('newListener', (event) => {
      if (!proxied && event === 'stream') {
        proxied = true;
        this.on('connection', (conn, req) => {
          this.emit('stream', new WebSocketStream(conn, opts), req)
        });
      };
    });

    if (cb) {
      this.on('stream', cb);
    }
  }
};

module.exports = Server;
