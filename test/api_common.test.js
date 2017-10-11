var API = require('../');
var expect = require('expect.js');
var config = require('./config');

describe('api_common', function () {

  describe('mixin', function () {
    it('should ok', function () {
      API.mixin({sayHi: function () {}});
      expect(API.prototype).to.have.property('sayHi');
    });

    it('should not ok when override method', function () {
      var obj = {sayHi: function () {}};
      expect(API.mixin).withArgs(obj).to.throwException(/Don't allow override existed prototype method\./);
    });
  });

  describe('getAccessToken', function () {
    it('should ok', function* () {
      var api = new API(config.corpid, config.corpsecret);
      var token = yield api.getAccessToken();
      expect(token).to.only.have.keys('accessToken');
    });

    it('should not ok', function* () {
      var api = new API(config.corpid, 'corpsecret');
      try {
        yield api.getAccessToken();
      } catch (err) {
        expect(err).to.have.property('name', 'WeChatAPIError');
        expect(err).to.have.property('message', 'invalid credential');
      }
    });
  });
});