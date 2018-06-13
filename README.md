# uws-stream

[![Build Status](https://travis-ci.org/charleslxh/uws-stream.svg?branch=master)](https://travis-ci.org/charleslxh/uws-stream)

Wrappered [uWebSockets](https://github.com/uNetworking/uWebSockets) with the Node Streams API.

## Install

```bash
$ npm install uws-stream --save
```

## Usage

### As a client

This module works in Node or in Browsers that support WebSockets. you can use `browserify` or `webpack` to package this module for browser use.

```javascript
const WebSocketStream = require('uws-stream');

const stream = WebSocketStream('ws://echo.websocket.org');
stream.on('data', (chunk) => {
  console.log('Your\'s input: ', chunk.toString());
});
stream.on('error', (error) => {
  console.log('error', error);
});
process.stdin.pipe(stream);
```

### On the server

1. Create an new server.

    ```js
    const http = require('http');
    const WebSocketStream = require('uws-stream');

    WebSocketStream.createServer({ port: 8443 }, (stream, req) => {
        stream.pipe(stream);
    });
    ```

2. Attach an exists server.

    ```js
    const http = require('http');
    const WebSocketStream = require('uws-stream');

    const server = http.createServer();

    WebSocketStream.createServer({ server: server }, (stream, req) => {
        stream.pipe(stream);
    });
    ```

#### Options

The available options differs depending on if you use this module in the browser or with node.js. Options can be passed in as the third or second argument - `WebSocket(address, [protocols], [options])`.

##### `options.browserBufferSize`

How much to allow the [socket.bufferedAmount](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket#Attributes) to grow before starting to throttle writes. This option has no effect in node.js.

Default: `1024 * 512` (512KiB)

##### `options.browserBufferTimeout`

How long to wait before checking if the socket buffer has drained sufficently for another write. This option has no effect in node.js.

Default: `1000` (1 second)

##### `options.objectMode`

Send each chunk on its own, and do not try to pack them in a single
websocket frame.

Default: `false`

##### `options.perMessageDeflate`

We recommend disabling the [per message deflate
extension](https://tools.ietf.org/html/rfc7692) to achieve the best
throughput.

Default: `true` on the client, `false` on the server.

Example:

```js
var WebSocketStream = require('uws-stream')
var ws = WebSocketStream('ws://realtimecats.com', {
  perMessageDeflate: false
})
```

Beware that this option is ignored by browser clients. To make sure that permessage-deflate is never used, disable it on the server.

##### Other options

When used in node.js see the [uws documentation](https://github.com/uNetworking/uWebSockets-bindings/blob/master/nodejs/README.md)

## Run the tests

```bash
$ npm test
```

## Contribute

1. fork.

2. install dependencies.

    ```bash
    $ npm install
    ```

3. run command.

    ```bash
    $ gulp
    ```
