'use strict';

const Stream = require('./src/stream');
const Server = require('./src/server');

module.exports = Stream;
module.exports.Server = Server;
module.exports.createServer = function(opts, cb) {
  return new Server(opts, cb);
};

