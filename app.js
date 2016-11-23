'use strict';

const express = require('express');
const session = require('express-session');

let app = express();

app.set('view engine', 'html');
app.engine('html', require('hogan-express-strict'));

app.use('/public/images', express.static('assets/images'));
app.use('/public', express.static('public'));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(require('i18n-future').middleware());
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));

app.use('/', require('./routes/payment'));

// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
    res.status(404).json(err);
});

const PORT = process.env.PORT || 3021;
app.listen(PORT);
// eslint-disable-next-line no-console
console.log(`App listening on port ${PORT}`);
