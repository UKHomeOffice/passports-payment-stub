'use strict';

const payment = require(`${APP_ROOT}/routes/payment`);
const express = require('express');
const cheerio = require('cheerio');

describe('Payment', function () {

    let app;

    beforeEach(function () {
        app = express();

        // setup app
        app.set('view engine', 'html');
        app.engine('html', require('hogan-express-strict'));
        app.use(require('express-session')(
            {
                secret: 'secret',
                resave: true,
                saveUninitialized: true
            }
        ));
        app.use(require('i18n-future').middleware());
        app.use(require('body-parser').urlencoded({ extended: true }));
        app.use(require('cookie-parser')());
        // use payment routes
        app.use(payment);
    });

    describe('/', function () {

        it('accepts a POST to start payment journey', function (done) {
            supertest(app)
                .post('/')
                .send('redirectionData={ "price":1234 }')
                .then((res) => {
                    res.status.should.be.below(400);
                    done();
                });
        });

        it('responds with an error for GET requests to \'/\'', function (done) {
            supertest.agent(app)
                .get('/')
                .expect(405)
                .then((res) => {
                    res.type.should.match(/application\/json/);
                    done();
                });
        });

        it('responds with an error with invalid POST data', function (done) {
            supertest(app)
                .post('/')
                .expect(400)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .then((res) => {
                    let msg = res.body.redirectionData.message;
                    msg.should.equal('`redirectionData` field is required');
                    done();
                });
        });

        it('redirects to /payment when POST request is successful', function (done) {
            supertest(app)
                .post('/')
                .send('redirectionData={ "price": 1234 }')
                .redirects(1)
                .expect(302, done);
        });

    });

    describe('/payment', function () {

        it('redirects to previous step if not completed', function (done) {
            let redirects = [];

            supertest(app)
                .get('/payment')
                .set('Content-Type', 'text/html')
                .redirects(1)
                .on('redirect', function (res) {
                    redirects.push(res.headers.location);
                })
                .then(() => {
                    redirects.should.eql(['/']);
                    done();
                });
        });

        describe('previous step completed', function () {
            let agent;

            beforeEach(function () {
                agent = supertest.agent(app);
            });

            it('responds with a non error response on GET requests', function (done) {
                agent
                    .post('/')
                    .send('redirectionData={ "price": 1234 }')
                    .then(() => {
                        return agent
                            .get('/payment');
                    })
                    .then((res) => {
                        res.status.should.equal(200);
                        done();
                    });
            });

            it('redirects to referrer from previous step on successful form submission', function (done) {
                agent
                    .post('/')
                    .set('Referrer', 'http://localhost:9999/')
                    .send('redirectionData={ "price": 1234 }')
                    .then(() => {
                        return agent
                            .get('/payment');
                    })
                    .then((res) => {
                        let $ = cheerio.load(res.text);
                        let action = $('form').attr('action');
                        action.should.equal('http://localhost:9999/');
                        done();
                    });
            });

        });

    });

});
