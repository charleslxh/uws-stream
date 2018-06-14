'use strict';

const polka = require('polka');

const app = polka();

app.use('*', (req, res) => res.end('OK'));

app.listen(7000, () => console.log('polka server started'));
