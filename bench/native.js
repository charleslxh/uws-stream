'use strict';

const { http } = require('uws');

const server = http.createServer((req, res) => res.end('OK'));

server.listen(7000, () => console.log('native server started'));
