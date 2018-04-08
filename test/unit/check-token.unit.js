import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { spy, stub } from 'sinon';
import { sign } from 'jsonwebtoken';

import config from '../../src/config/config';
import checkToken from '../../src/middlewares/security/check-token';

chai.use(sinonChai);
chai.config.includeStack = true;

/* eslint no-unused-expressions: "off" */
/* eslint no-undef: "off" */
describe('## Test check token middleware', () => {
  describe('# Test empty values', () => {
    it('Correct work with OPTIONS method', () => {
      const req = {
        method: 'OPTIONS',
        headers: {
          'x-access-token': '',
        },
      };
      const next = spy();
      checkToken(req, {}, next);
      expect(next).to.have.been.calledOnce;
    });
  });

  describe('# Test with empty token', () => {
    const req = {
      headers: {
        'x-access-token': null,
      },
    };
    const res = {
      status: stub(),
    };
    const send = spy();
    res.status
      .withArgs(403)
      .returns({ send });
    const next = spy();

    it('Correct return FORBIDDEN', () => {
      checkToken(req, res, next);
      expect(send).to.have.been.calledWith({
        success: false,
        message: 'No token provided.',
      });
      expect(next).to.have.not.been.called;
    });
  });

  describe('# Test token validity', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
      req = {
        headers: {
          'x-access-token': 'Invalid token',
        },
      };
      res = {
        json: spy(),
      };
      next = spy();
    });

    it('When invalid token', (done) => {
      checkToken(req, res, next).then(() => {
        expect(res.json).to.have.been.calledOnce;
        expect(next).to.have.not.been.called;
        done();
      });
    });

    it('When valid token', (done) => {
      req.headers['x-access-token'] =
        sign({}, config.server.security.secret, { expiresIn: 100 });
      checkToken(req, res, next).then(() => {
        expect(next).to.have.been.calledOnce;
        expect(res.json).to.have.not.been.called;
        done();
      });
    });
  });
  // describe('# Test with some values', () => {
  //   const req = {
  //     headers: {
  //       cookie: 'lol=kek;hello=world;dratuti=dorou',
  //     },
  //   };
  //   const res = {};
  //   const next = spy();
  //   it('Correct work with some values', () => {
  //     checkToken(req, res, next);
  //     expect(res.parsedCookies.lol).to.equal('kek');
  //     expect(res.parsedCookies.hello).to.equal('world');
  //     expect(res.parsedCookies.dratuti).to.equal('dorou');
  //     expect(next).to.have.been.called;
  //   });
  // });
});
