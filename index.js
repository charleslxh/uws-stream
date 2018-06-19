'use strict';

var Stream = require('./lib/stream');
var Server = require('./lib/server');

module.exports = Stream;
module.exports.Server = Server;
module.exports.createServer = function(opts, cb) {
  return new Server(opts, cb);
};

