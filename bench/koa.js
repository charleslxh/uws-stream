'use strict';

const Koa = require('koa');

const app = new Koa();

app.use(ctx => ctx.body = 'OK');

app.listen(7000, () => console.log('koa server started'));
