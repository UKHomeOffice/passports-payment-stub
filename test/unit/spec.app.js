'use strict';

describe('app.js', function () {

    let app,
        mocks,
        imageMiddleware,
        publicMiddleware;

    beforeEach(function () {
        app = {
            set: sinon.stub(),
            engine: sinon.stub(),
            use: sinon.stub(),
            listen: sinon.stub(),
        };

        mocks = {
            express: sinon.stub().returns(app),
            session: sinon.stub().returns(function () {}),
            hogan: sinon.stub(),
            translation: {
                middleware: sinon.stub().returns(function () {})
            },
            cookies: sinon.stub().returns(function () {}),
            bodyParser: {
                urlencoded: sinon.stub().returns(function () {})
            },
            payment: sinon.stub(),
            errorHandler: sinon.stub().returns(function () {})
        };

        imageMiddleware = sinon.stub();
        publicMiddleware = sinon.stub();

        mocks.express.static = sinon.stub();
        mocks.express.static.withArgs('assets/images').returns(imageMiddleware);
        mocks.express.static.withArgs('public').returns(publicMiddleware);

        proxyquire(`${APP_ROOT}/app`, {
            express: mocks.express,
            'express-session': mocks.session,
            'hogan-express-strict': mocks.hogan,
            'i18n-future': mocks.translation,
            'cookie-parser': mocks.cookies,
            'body-parser': mocks.bodyParser,
            './routes/payment': mocks.payment,
            './middleware/error-handler': mocks.errorHandler
        });
    });

    it('creates an Express app', function () {
        mocks.express.should.have.been.calledWithExactly();
    });

    it('sets view engine', function () {
        app.set.should.have.been.calledWith('view engine', 'html');
    });

    it('sets engine type', function () {
        app.engine.should.have.been.calledWith('html', mocks.hogan);
    });

    it('exposes images assets on /public/images', function () {
        app.use.should.have.been.calledWithExactly('/public/images', imageMiddleware);
    });

    it('exposes assets in public directory', function () {
        app.use.should.have.been.calledWithExactly('/public', publicMiddleware);
    });

    it('adds session middleware', function () {
        mocks.session.should.have.been.calledWithExactly({
            secret: 'secret',
            resave: true,
            saveUninitialized: true
        });
        app.use.should.have.been.calledWithExactly(mocks.session());
    });

    it('adds translation middleware', function () {
        mocks.translation.middleware.should.have.been.calledWithExactly();
        app.use.should.have.been.calledWithExactly(mocks.translation.middleware());
    });

    it('adds cookie parsing middleware', function () {
        mocks.cookies.should.have.been.calledWithExactly();
        app.use.should.have.been.calledWithExactly(mocks.cookies());
    });

    it('adds body parsing middleware', function () {
        mocks.bodyParser.urlencoded.should.have.been.calledWithExactly({ extended: true });
        app.use.should.have.been.calledWithExactly(mocks.bodyParser.urlencoded());
    });

    it('mounts payment handling routes on \'/\'', function () {
        app.use.should.have.been.calledWithExactly('/', mocks.payment);
    });

    it('adds error handling function', function () {
        app.use.should.have.been.calledWithExactly(mocks.errorHandler);
    });

    it('listens on a default port', function () {
        app.listen.should.have.been.calledWithExactly(3021);
    });

});
