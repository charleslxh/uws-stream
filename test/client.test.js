'use strict';

var assert = require('assert');

var WebSocketStream = require('../');
var EchoServer = require('./echo-server');

describe('uws-stream', function() {
  describe('echo server wroks', function() {
    before(function(done) {
      EchoServer.start({}, done);
    });

    it('write should work before socket open.', function (done) {
      var stream = new WebSocketStream(EchoServer.url);

      stream.on('data', function(chunk) {
        assert.strictEqual(Buffer.isBuffer(chunk), true);
        stream.destroy();
        stream.end();
        done();
      });

      var data = JSON.stringify({
        event: 'echo',
        data: 'hello uws'
      });

      stream.write(Buffer.from(data));
    });

    it('should be Buffer', function (done) {
      var stream = new WebSocketStream(EchoServer.url);

      stream.on('data', function(chunk) {
        assert.strictEqual(Buffer.isBuffer(chunk), true);
        stream.destroy();
        stream.end();
        done();
      });

      var data = JSON.stringify({
        event: 'echo',
        data: 'hello uws'
      });

      stream.on('connect', function() {
        stream.write(Buffer.from(data));
      });
    });

    it('coerce client data as binary', function (done) {
      var stream = new WebSocketStream(EchoServer.url);

      stream.on('data', function(chunk) {
        assert.strictEqual(chunk.toString(), '[object Uint8Array]');
        stream.destroy();
        stream.end();
        done();
      });

      var data = JSON.stringify({
        event: 'check chunk type',
        data: 'hello uws'
      });

      stream.on('connect', function() {
        stream.write(Buffer.from(data));
      });
    });

    it('should get "hello uws" from websocket server', function (done) {
      var stream = new WebSocketStream(EchoServer.url);

      stream.on('data', function(chunk) {
        assert.strictEqual(chunk.toString(), 'hello uws');
        stream.destroy();
        stream.end();
        done();
      });

      var data = JSON.stringify({
        event: 'echo',
        data: 'hello uws'
      });

      stream.on('connect', function() {
        stream.write(Buffer.from(data));
      });
    });

    it('should get "hello uws" twice from websocket server', function (done) {
      var stream = new WebSocketStream(EchoServer.url);

      var data = JSON.stringify({
        event: 'echo',
        data: 'hello uws'
      });

      stream.once('data', function(chunk) {
        assert.strictEqual(chunk.toString(), 'hello uws');

        stream.once('data', function(chunk) {
          assert.strictEqual(chunk.toString(), 'hello uws');
          stream.destroy();
          stream.end();
          done();
        });
        stream.write(Buffer.from(data));
      });

      stream.on('connect', function() {
        stream.write(Buffer.from(data));
      });
    });

    after(function(done) {
      EchoServer.stop(done);
    });
  });

  describe('objectMode server', function() {
    before(function(done) {
      EchoServer.start({ objectMode: true }, done);
    });

    it('should get "hello uws with objectMode" ', function (done) {
      var stream = new WebSocketStream(EchoServer.url);

      stream.on('data', function(chunk) {
        assert.strictEqual(Buffer.isBuffer(chunk), true);
        assert.strictEqual(chunk.toString(), 'hello uws');
        stream.destroy();
        stream.end();
        done();
      });

      var data = JSON.stringify({
        event: 'echo',
        data: 'hello uws'
      });

      stream.on('connect', function() {
        stream.write(Buffer.from(data));
      });
    });

    after(function(done) {
      EchoServer.stop(done);
    });
  });
});
