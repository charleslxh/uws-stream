'use strict';

const express = require('express');

const app = express();

app.use('/', (req, res) => res.end('OK'));

app.listen(7000, () => console.log('express server started'));
