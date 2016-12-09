'use strict';

const Controller = require('hmpo-form-wizard').Controller;

class Receiver extends Controller {

    constructor(options) {
        super(options);
    }

    process(req, res, callback) {
        var data = req.form.values.redirectionData;
        if (data) {
            data = JSON.parse(data);
            req.form.values.cost = data.price;
        }
        callback();
    }

    saveValues(req, res, callback) {
        req.form.values['return-url'] = req.get('referrer');
        super.saveValues(req, res, callback);
    }

    // eslint-disable-next-line no-unused-vars
    errorHandler(err, req, res, callback) {
        res.status(err.statusCode || 400).json(err);
    }

}

Receiver.prototype.get = null;

module.exports = Receiver;
