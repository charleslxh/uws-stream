'use strict';

const koa = require('koa');

const app = koa();

app.use('*', (req, res) => res.end('OK'));

app.listen(7000, () => console.log('koa server started'));
