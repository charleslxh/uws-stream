'use strict';

const http = require('http');

const server = http.createServer((req, res) => res.end('OK'));

server.listen(7000, () => console.log('http server started'));
