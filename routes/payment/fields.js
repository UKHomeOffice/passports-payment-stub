'use strict';

module.exports = {
    redirectionData: {
        validate: 'required'
    },
    redirectVersion: {},
    transactId: {},
    cardnumberfield: {},
    expirydatefield: {
        inexact: true
    },
    'expirydatefield-month': {
        labelClassName: 'form-label'
    },
    'expirydatefield-year': {
        labelClassName: 'form-label'
    },
    cvvfield: {
        className: 'code'
    }
};
