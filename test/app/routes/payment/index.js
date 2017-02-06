'use strict';

const express = require('express');

let router = express.Router();

module.exports = function (app) {
    router.route('/')
        .get(function (req, res/*, next*/) {
            let locals = {
                action: app.get('STUB_URL'),
                'redirection-data': JSON.stringify({ price: 7250 })
            };

            if (req.session.returned) {
                delete req.session.returned;
            }

            res.render('payment', locals);
        })
        .post(function (req, res/*, next*/) {
            req.session.returned = true;
            res.redirect('/');
        });

    return router;
};
