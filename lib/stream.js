'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Duplex = require('readable-stream').Duplex;
var WebSocket = require('uws');
var Buffer = require('safe-buffer').Buffer;

var MERGE_DEFAULT_OPTIONS = Symbol('WebSocketStream#mergeDefaults');
var WRITE_BUFFER = Symbol('WebSocketStream#write_buffer');
var SOCKET = Symbol('WebSocketStream#socket');
var ONOPEN = Symbol('WebSocketStream#onopen');
var ONCLOSE = Symbol('WebSocketStream#onclose');
var ONERROR = Symbol('WebSocketStream#onerror');
var ONMESSAGE = Symbol('WebSocketStream#onmessage');

var isBrowser = process.title === 'browser';
var isNative = !!global.WebSocket;

var isArray = Array.isArray || function (target) {
  return Object.prototype.toString.call(target) === '[object Array]';
};

var isPlainObject = function isPlainObject(target) {
  return Object.prototype.toString.call(target) === '[object Object]';
};

var isString = function isString(target) {
  return 'string' === typeof target;
};

var WebSocketStream = function (_Duplex) {
  _inherits(WebSocketStream, _Duplex);

  function WebSocketStream(target, protocols, options) {
    _classCallCheck(this, WebSocketStream);

    var _this = _possibleConstructorReturn(this, (WebSocketStream.__proto__ || Object.getPrototypeOf(WebSocketStream)).call(this, options));

    _this[WRITE_BUFFER] = [];

    if (isPlainObject(protocols)) {
      options = protocols;
      protocols = null;
    }

    _this.options = _this[MERGE_DEFAULT_OPTIONS](options);

    if (_this.options.protocols && (isArray(_this.options.protocols) || isString(_this.options.protocols))) {
      protocols = options.protocols;
      delete options.protocols;
    }

    if ('object' === typeof target) {
      _this[SOCKET] = target;
    } else {
      if (isNative && isBrowser) {
        _this[SOCKET] = new WebSocket(target, protocols);
      } else {
        _this[SOCKET] = new WebSocket(target, protocols, options);
      }

      _this[SOCKET].binaryType = 'arraybuffer';
    }

    _this[SOCKET].onopen = _this[ONOPEN].bind(_this);
    _this[SOCKET].onclose = _this[ONCLOSE].bind(_this);
    _this[SOCKET].onerror = _this[ONERROR].bind(_this);
    _this[SOCKET].onmessage = _this[ONMESSAGE].bind(_this);
    return _this;
  }

  _createClass(WebSocketStream, [{
    key: MERGE_DEFAULT_OPTIONS,
    value: function value(options) {
      return Object.assign({}, {
        objectMode: false,
        protocols: null,
        browserBufferSize: 512 * 1024,
        browserBufferTimeout: 1000,
        perMessageDeflate: false
      }, options);
    }
  }, {
    key: '_read',
    value: function _read() {
      // Do nothing
    }
  }, {
    key: '_write',
    value: function _write(chunk, encode, next) {
      var _this2 = this;

      if (!this.options.objectMode && isString(chunk)) {
        chunk = Buffer.from(chunk, 'utf8');
      }

      try {
        if (isBrowser) {
          this[SOCKET].bufferedAmount > this.options.browserBufferSize ? setTimeout(function () {
            return _this2[WRITE](chunk, encode, next);
          }, this.options.browserBufferTimeout) : this[SOCKET].send(chunk) && next();
        } else {
          this[SOCKET].readyState === this[SOCKET].OPEN ? this[SOCKET].send(chunk, { binary: !this.options.objectMode }, next) : this[WRITE_BUFFER].push({ chunk: chunk, encode: encode }) && next();
        }
      } catch (err) {
        next(err);
      }
    }
  }, {
    key: '_flush',
    value: function _flush(cb) {
      if (this[SOCKET]) this[SOCKET].close();
      if (cb) cb();
    }
  }, {
    key: '_destroy',
    value: function _destroy(err, cb) {
      if (this[SOCKET]) this[SOCKET].close();
      if (err) this.emit('error', err);
      if (cb) cb();
    }
  }, {
    key: ONOPEN,
    value: function value() {
      this.emit('connect');
      if (this[WRITE_BUFFER].length > 0) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this[WRITE_BUFFER][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _ref = _step.value;
            var chunk = _ref.chunk;
            var encode = _ref.encode;

            this.write(chunk, encode);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    }
  }, {
    key: ONCLOSE,
    value: function value() {
      this.end();
      this.destroy();
    }
  }, {
    key: ONERROR,
    value: function value(err) {
      this.destroy(err);
    }
  }, {
    key: ONMESSAGE,
    value: function value(event) {
      var data = Buffer.from(event.data);
      this.push(data);
    }
  }, {
    key: 'socket',
    get: function get() {
      return this[SOCKET];
    }
  }, {
    key: 'remotePort',
    get: function get() {
      return this[SOCKET] ? this[SOCKET]._socket.remotePort : null;
    }
  }, {
    key: 'remoteAddress',
    get: function get() {
      return this[SOCKET] ? this[SOCKET]._socket.remoteAddress : null;
    }
  }, {
    key: 'remoteFamily',
    get: function get() {
      return this[SOCKET] ? this[SOCKET]._socket.remoteFamily : null;
    }
  }]);

  return WebSocketStream;
}(Duplex);

module.exports = WebSocketStream;