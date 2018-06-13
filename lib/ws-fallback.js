'use strict';

var ws = null;

// In browser
if (typeof WebSocket !== 'undefined') {
  ws = WebSocket;
} else if (typeof MozWebSocket !== 'undefined') {
  ws = MozWebSocket;
} else if (typeof window !== 'undefined') {
  ws = window.WebSocket || window.MozWebSocket;
}

if (!ws) {
  throw new Error('WebSocket is not support, please upgrade your browser.');
}

module.exports = ws;