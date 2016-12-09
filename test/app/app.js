'use strict';

const express = require('express');
const session = require('express-session');
const path = require('path');

let app = express();

app.set('view engine', 'html');
app.set('views', path.resolve(__dirname + '/views'));
app.engine('html', require('hogan-express-strict'));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

const STUB_URL = process.env.STUB_URL || 'http://localhost:3021/';

app.set('STUB_URL', STUB_URL);

app.use('/', require('./routes/payment')(app));

// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
    res.send('Oops, something went wrong!');
});

const port = 3022;

app.listen(port);
// eslint-disable-next-line no-console
console.log(`App listening on port ${port}`);
