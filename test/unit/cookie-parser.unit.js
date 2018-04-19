import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { spy } from 'sinon';
import cookieParser from '../../src/middlewares/cookie-parser';

chai.use(sinonChai);
chai.config.includeStack = true;

/* eslint no-unused-expressions: "off" */
/* eslint no-undef: "off" */
describe('## Test cookieParser', () => {
  describe('# Test empty values', () => {
    it('Correct work with empty values', () => {
      const next = spy();
      cookieParser({ headers: {} }, {}, next);
      expect(next).to.have.been.called;
    });
  });

  describe('# Test with some values', () => {
    const req = {
      headers: {
        cookie: 'lol=kek;hello=world;dratuti=dorou',
      },
    };
    const res = {};
    const next = spy();
    it('Correct work with some values', () => {
      cookieParser(req, res, next);
      expect(res.parsedCookies.lol).to.equal('kek');
      expect(res.parsedCookies.hello).to.equal('world');
      expect(res.parsedCookies.dratuti).to.equal('dorou');
      expect(next).to.have.been.called;
    });
  });
});
