'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WebSocketServer = require('uws').Server;
var WebSocketStream = require('./stream');

var Server = function (_WebSocketServer) {
  _inherits(Server, _WebSocketServer);

  function Server(opts, cb) {
    _classCallCheck(this, Server);

    var _this = _possibleConstructorReturn(this, (Server.__proto__ || Object.getPrototypeOf(Server)).call(this, opts));

    var proxied = false;
    _this.on('newListener', function (event) {
      if (!proxied && event === 'stream') {
        proxied = true;
        _this.on('connection', function (conn, req) {
          _this.emit('stream', new WebSocketStream(conn, opts), req);
        });
      };
    });

    if (cb) {
      _this.on('stream', cb);
    }
    return _this;
  }

  return Server;
}(WebSocketServer);

;

module.exports = Server;