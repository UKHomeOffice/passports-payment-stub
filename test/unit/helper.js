const reqres = require('reqres');
const chai = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru().noPreserveCache();

chai.should();
chai.use(require('sinon-chai'));

global.APP_ROOT = require('path').resolve(__dirname, '../../');
global.expect = chai.expect;
global.request = reqres.req;
global.response = reqres.res;
global.sinon = sinon;
global.proxyquire = proxyquire;
