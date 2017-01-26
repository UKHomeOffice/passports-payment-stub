'use strict';

const Base = require('hmpo-form-wizard').Controller;

const Controller = require(`${APP_ROOT}/controllers/receiver`);

describe('Receiver Controller', function () {

    let controller,
        req,
        res,
        cb;

    beforeEach(function () {
        controller = new Controller({ route: '/index' });
        req = request();
        res = response();
        cb = sinon.stub();
    });

    it('exports a function', function () {
        Controller.should.be.a('function');
    });

    it('is an instance of Wizard Controller', function () {
        controller.should.be.an.instanceOf(Base);
    });

    it('calls parent method with options', function () {
        let spy = sinon.spy();

        const ProxiedController = proxyquire(`${APP_ROOT}/controllers/receiver`, {
            'hmpo-form-wizard': {
                Controller: spy
            }
        });

        controller = new ProxiedController({ template: 'index' });
        spy.should.have.been.calledOnce;
        spy.should.have.been.calledWithExactly({ template: 'index' });
    });

    it('does not allow GET requests', function () {
        expect(controller.get).to.not.be.ok;
    });

    describe('process', function () {

        beforeEach(function () {
            req.form = {
                values: {
                    redirectionData: '{"price":1234}'
                }
            };
        });

        it('is a function', function () {
            Controller.prototype.process.should.be.a('function');
        });

        it('parses `redirectionData` and adds data to form values', function () {
            controller.process(req, res, cb);
            req.form.values.cost.should.equal(1234);
        });

        it('doesn\'t add `redirectionData` data when it doesn\'t exist', function () {
            delete req.form.values.redirectionData;
            controller.process(req, res, cb);
            expect(req.form.values.cost).to.not.be.ok;
        });

        it('calls callback', function () {
            controller.process(req, res, cb);
            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly();
        });

    });

    describe('saveValues', function () {

        beforeEach(function () {
            req.form = { values: {} };
            req.get.withArgs('referrer').returns('https://mysite.com/payment');
            sinon.stub(Base.prototype, 'saveValues');
        });

        afterEach(function () {
            Base.prototype.saveValues.restore();
        });

        it('is a function', function () {
            Controller.prototype.saveValues.should.be.a('function');
        });

        it('sets referrer to form values', function () {
            controller.saveValues(req, res, cb);
            req.form.values['return-url'].should.equal('https://mysite.com/payment');
        });

        it('calls parent method', function () {
            controller.saveValues(req, res, cb);
            Base.prototype.saveValues.should.have.been.calledWithExactly(req, res, cb);
        });

    });

    describe('errorHandler', function () {

        it('responds with 400 status', function () {
            controller.errorHandler({}, req, res, cb);
            res.status.should.have.been.calledWithExactly(400);
        });

        it('responds with error as JSON', function () {
            controller.errorHandler({ message: 'Error' }, req, res, cb);
            res.json.should.have.been.calledWithExactly({ message: 'Error' });
        });

    });

});
