'use strict';

// eslint-disable-next-line no-unused-vars
module.exports = function (err, req, res, next) {
    res.status(404).json(err);
};
