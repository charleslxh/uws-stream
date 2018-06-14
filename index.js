'use strict';

const Stream = require('./lib/stream');
const Server = require('./lib/server');

module.exports = Stream;
module.exports.Server = Server;
module.exports.createServer = function(opts, cb) {
  return new Server(opts, cb);
};

