'use strict';

const Duplex = require('readable-stream').Duplex;
const WebSocket = require('uws');
const Buffer = require('safe-buffer').Buffer;

const MERGE_DEFAULT_OPTIONS = Symbol('WebSocketStream#mergeDefaults');
const WRITE_BUFFER = Symbol('WebSocketStream#write_buffer');
const SOCKET = Symbol('WebSocketStream#socket');
const ONOPEN = Symbol('WebSocketStream#onopen');
const ONCLOSE = Symbol('WebSocketStream#onclose');
const ONERROR = Symbol('WebSocketStream#onerror');
const ONMESSAGE = Symbol('WebSocketStream#onmessage');

const isBrowser = process.title === 'browser';
const isNative = !!global.WebSocket;

const isArray = Array.isArray || function(target) {
  return Object.prototype.toString.call(target) === '[object Array]'
}

const isPlainObject = function(target) {
  return Object.prototype.toString.call(target) === '[object Object]'
}

const isString = function(target) {
  return 'string' === typeof target
}

class WebSocketStream extends Duplex {
  constructor(target, protocols, options) {
    super(options);

    this[WRITE_BUFFER] = [];

    if (isPlainObject(protocols)) {
      options = protocols;
      protocols = null;
    }

    this.options = this[MERGE_DEFAULT_OPTIONS](options);

    if (this.options.protocols && (isArray(this.options.protocols) || isString(this.options.protocols))) {
      protocols = options.protocols;
      delete options.protocols;
    }

    if ('object' === typeof target) {
      this[SOCKET] = target;
    } else {
      if (isNative && isBrowser) {
        this[SOCKET] = new WebSocket(target, protocols);
      } else {
        this[SOCKET] = new WebSocket(target, protocols, options);
      }

      this[SOCKET].binaryType = 'arraybuffer';
    }

    this[SOCKET].onopen = this[ONOPEN].bind(this);
    this[SOCKET].onclose = this[ONCLOSE].bind(this);
    this[SOCKET].onerror = this[ONERROR].bind(this);
    this[SOCKET].onmessage = this[ONMESSAGE].bind(this);
  }

  get socket() {
    return this[SOCKET];
  }

  [MERGE_DEFAULT_OPTIONS](options) {
    return Object.assign({}, {
      objectMode: false,
      protocols: null,
      browserBufferSize: 512 * 1024,
      browserBufferTimeout: 1000,
      perMessageDeflate: false
    }, options);
  }

  _read() {
    // Do nothing
  }

  _write(chunk, encode, next) {
    if (!this.options.objectMode && isString(chunk)) {
      chunk = Buffer.from(chunk, 'utf8');
    }

    try {
      if (isBrowser) {
        this[SOCKET].bufferedAmount > this.options.browserBufferSize ?
          setTimeout(() => this[WRITE](chunk, encode, next), this.options.browserBufferTimeout) :
          this[SOCKET].send(chunk) && next();
      } else {
        this[SOCKET].readyState === this[SOCKET].OPEN ?
          this[SOCKET].send(chunk, { binary: !this.options.objectMode }, next) :
          this[WRITE_BUFFER].push({ chunk: chunk, encode: encode }) && next();
      }
    } catch (err) {
      next(err)
    }
  }

  _flush(cb) {
    if (this[SOCKET]) this[SOCKET].close();
    if (cb) cb();
  }

  _destroy(err, cb) {
    if (this[SOCKET]) this[SOCKET].close();
    if (err) this.emit('error', err);
    if (cb) cb();
  }

  [ONOPEN]() {
    this.emit('connect');
    if (this[WRITE_BUFFER].length > 0) {
      for(let { chunk, encode } of this[WRITE_BUFFER]) {
        this.write(chunk, encode);
      }
    }
  }

  [ONCLOSE]() {
    this.end();
    this.destroy();
  }

  [ONERROR](err) {
    this.destroy(err);
  }

  [ONMESSAGE](event) {
    const data = Buffer.from(event.data);
    this.push(data);
  }
}

module.exports = WebSocketStream;
