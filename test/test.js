'use strict';

var assert = require('assert');

var WebSocketStream = require('../');
var EchoServer = require('./echo-server');

EchoServer.start({}, function(err) {
  if (err) {
    console.log('start server failed with Exception:', e.message);
  } else {
    console.log('echo server started');
    console.log('You can input anything, the server will response what you input.')
  }
});

var stream = new WebSocketStream(EchoServer.url);

stream.on('data', function(chunk) {
  console.log(stream.remoteAddress);
  console.log('Your\'s input: ', chunk.toString());
});

stream.on('error', function(error) {
  console.log('error', error);
});

process.stdin.pipe(stream);
