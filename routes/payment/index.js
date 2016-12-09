'use strict';

const express = require('express');
const steps = require('./steps');
const fields = require('./fields');

let router = express.Router();

router.use(require('hmpo-template-mixins')(fields));

router.use(require('hmpo-form-wizard')(steps, fields, {
    name: 'passports-payment-stub'
}));

module.exports = router;
