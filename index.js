'use strict';

const stream = require('./src/stream');
const server = require('./src/server');

module.exports = stream;
module.exports.server = server
module.exports.createServer = createServer
