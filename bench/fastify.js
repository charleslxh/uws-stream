'use strict';

const fastify = require('fastify');

const app = fastify();

app.use('*', (req, res) => res.end('OK'));

app.listen(7000, () => console.log('fastify server started'));
