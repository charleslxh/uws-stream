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
  console.log('[client] Your\'s input: ', chunk.toString());

  if (chunk.toString().trim() === 'exit') {
    stream.destroy();
    stream.end();
  }
});

stream.on('error', function(error) {
  console.log('[client] error', error);
});

stream.on('close', function() {
  console.log('[client] client closed');
});

process.stdin.pipe(stream);
