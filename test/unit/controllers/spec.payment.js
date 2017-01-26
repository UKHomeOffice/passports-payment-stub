'use strict';

const Base = require('hmpo-form-wizard').Controller;
const fs = require('fs');

const Controller = require(`${APP_ROOT}/controllers/payment`);

describe('Payment Controller', function () {

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

        const ProxiedController = proxyquire(`${APP_ROOT}/controllers/payment`, {
            'hmpo-form-wizard': {
                Controller: spy
            }
        });

        controller = new ProxiedController({ template: 'index' });
        spy.should.have.been.calledOnce;
        spy.should.have.been.calledWithExactly({ template: 'index' });
    });

    describe('getValues', function () {

        let xmlStr = '<?xml?><paymentManualConfirmation><response responseCode="00" /></paymentManualConfirmation>';

        beforeEach(function () {
            sinon.stub(Base.prototype, 'getValues').yields(null, {});
            sinon.stub(fs, 'readFile').yields(null, xmlStr);
        });

        afterEach(function () {
            Base.prototype.getValues.restore();
            fs.readFile.restore();
        });

        it('is a function', function () {
            Controller.prototype.getValues.should.be.a('function');
        });

        it('calls parent mehtod', function () {
            controller.getValues(req, res, cb);
            Base.prototype.getValues.should.have.been.calledOnce;
            Base.prototype.getValues.should.have.been.calledWithExactly(req, res, sinon.match.func);
        });

        it('adds a base64 encoded success XML response to values', function () {
            controller.getValues(req, res, cb);
            fs.readFile.should.have.been.calledWithExactly(`${APP_ROOT}/lib/payment.xml`, sinon.match.func);
            cb.should.have.been.calledWithExactly(null, {
                'fake-response': xmlStr.toString('base64')
            });
        });

        it('calls callback', function () {
            controller.getValues(req, res, cb);
            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly(null, {
                'fake-response': xmlStr.toString('base64')
            });
        });

        it('calls callback with parent method error', function () {
            Base.prototype.getValues.yields({ message: 'getValues error' });
            controller.getValues(req, res, cb);
            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly({ message: 'getValues error' });
        });

        it('calls callback with file read error', function () {
            fs.readFile.yields({ message: 'read file error' });
            controller.getValues(req, res, cb);
            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly({ message: 'read file error' });
        });

    });

    describe('locals', function () {

        beforeEach(function () {
            req.form = {
                values: {
                    'return-url': 'https://mysite.com/payment',
                    cost: 1234
                }
            };
            sinon.stub(Base.prototype, 'locals').returns({});
        });

        afterEach(function () {
            Base.prototype.locals.restore();
        });

        it('is a function', function () {
            Controller.prototype.locals.should.be.a('function');
        });

        it('calls parent method', function () {
            controller.locals(req, res);
            Base.prototype.locals.should.have.been.calledWithExactly(req, res);
        });

        it('adds form action from form values', function () {
            let locals = controller.locals(req, res);
            locals.action.should.equal('https://mysite.com/payment');
        });

        it('adds cost in pounds', function () {
            let locals = controller.locals(req, res);
            locals.cost.should.equal(12.34);
        });

    });

});
