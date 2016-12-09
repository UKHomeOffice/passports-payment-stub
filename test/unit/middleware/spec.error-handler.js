'use strict';

const middleware = require(`${APP_ROOT}/middleware/error-handler`);

describe('Error Handler Middleware', function () {

    let err, req, res, cb;

    beforeEach(function () {
        err = {
            message: 'Error'
        };
        req = request();
        res = response();
    });

    it('exports a function', function () {
        middleware.should.be.a('function');
        middleware.length.should.equal(4);
    });

    it('sets status code and returns error as json', function () {
        middleware(err, req, res, cb);
        res.status.should.have.been.calledWithExactly(404);
        res.json.should.have.been.calledWithExactly({ message: 'Error' });
    });

});
