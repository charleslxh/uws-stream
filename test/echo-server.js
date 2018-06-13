'use strict';

var http = require('http');
var ws = require('../');

let server = null;

exports.port = 8443;
exports.url = 'ws://localhost:' + exports.port;

exports.start = function(options, cb) {
  if (!options) options = {};
  if (!cb) cb = function() {};

  if (server) {
    return cb();
  }

  options.server = server = http.createServer();
  ws.createServer(options, function(stream, req) {
    stream.on('data', function(chunk) {
      try {
        var message = JSON.parse(chunk.toString());
      } catch (e) {
        stream.write(chunk);
        return;
      }

      switch (message.event) {
        case 'echo':
          stream.write(Buffer.from(message.data));
          break;
        case 'check chunk type':
          var type = Object.prototype.toString.call(chunk);
          stream.write(Buffer.from(type));
          break;
        default:
          stream.write(Buffer.from('unknow event'));
          break;
      }
    });
  });

  server.once('listening', cb);
  server.once('error', cb);
  server.listen(exports.port);
};

exports.stop = function(cb) {
  if (!cb) cb = function() {};

  if (!server) {
    return cb();
  }

  server.once('close', cb);
  server.once('error', cb);
  server.close();
  server = null;
};
