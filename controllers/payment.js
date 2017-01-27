'use strict';

const path = require('path');
const fs = require('fs');

const _ = require('lodash');
const Controller = require('hmpo-form-wizard').Controller;

class Payment extends Controller {

    getValues(req, res, callback) {
        super.getValues(req, res, function (err, values) {
            if (err) { return callback(err); }

            fs.readFile(path.resolve(__dirname, '../lib/payment.xml'), (err, xml) => {
                if (err) { return callback(err); }

                values['fake-response'] = xml.toString('base64');
                callback(null, values);
            });
        });
    }

    locals(req, res) {
        return _.extend(super.locals(req, res), {
            action: req.form.values['return-url'],
            cost: req.form.values.cost && req.form.values.cost / 100
        });
    }

}

module.exports = Payment;
