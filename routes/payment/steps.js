'use strict';

module.exports = {
    '/': {
        controller: require('../../controllers/receiver'),
        csrf: false,
        checkSession: false,
        fields: [
            'redirectionData'
        ],
        next: '/payment'
    },
    '/payment': {
        controller: require('../../controllers/payment')
    }
};
