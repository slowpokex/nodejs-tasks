import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import faker from 'faker';
import { verify } from 'jsonwebtoken';
import { promisify } from 'util';

import app from '../../src';
import config from '../../src/config/config';

chai.config.includeStack = true;

/* eslint no-unused-expressions: "off" */
/* eslint no-undef: "off" */
describe('## Overall tests', () => {
  describe('# GET /404', () => {
    it('should return 404 status', (done) => {
      request(app)
        .get('/404')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found');
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api when we unauthorized', () => {
    it('should return unauthorized status', (done) => {
      request(app)
        .get('/api')
        .expect(httpStatus.FORBIDDEN)
        .then((res) => {
          expect(res.body.message).to.equal('No token provided.');
          done();
        })
        .catch(done);
    });
  });

  describe('## Security actions', () => {
    const newUser = {
      login: faker.internet.userName(),
      password: faker.internet.password(),
      displayName: faker.name.findName(),
    };

    describe('# Register actions', () => {
      it('should return 500 status (Empty body) when register', (done) => {
        request(app)
          .post('/register')
          .expect(httpStatus.INTERNAL_SERVER_ERROR)
          .then(() => {
            done();
          })
          .catch(done);
      });

      it('should return 200 status (With body)', (done) => {
        request(app)
          .post('/register')
          .send(newUser)
          .expect(httpStatus.CREATED)
          .then((res) => {
            expect(res.body.login).to.equal(newUser.login);
            expect(res.body.displayName).to.equal(newUser.displayName);
            expect(res.body.role).to.equal('USER');
            done();
          })
          .catch(done);
      });
    });

    describe('# Auth actions', () => {
      it('should return 403 forbidden status (Empty body)', (done) => {
        request(app)
          .post('/auth')
          .expect(httpStatus.FORBIDDEN)
          .then((res) => {
            expect(res.body.success).to.equal(false);
            expect(res.body.message).to.equal('Bad username/password combination.');
            done();
          })
          .catch(done);
      });

      it('should return 200 status (With body) and return token', (done) => {
        request(app)
          .post('/auth')
          .send(newUser)
          .expect(httpStatus.OK)
          .then((res) => {
            expect(res.body.status).to.equal(httpStatus.OK);
            expect(res.body.message).to.equal('OK');
            expect(res.body.payload.login).to.equal(newUser.login);
            expect(res.body.payload.displayName).to.equal(newUser.displayName);
            expect(res.body.payload.role).to.equal('USER');
            return promisify(verify)(res.body.token, config.server.security.secret);
          })
          .then(() => done())
          .catch(done);
      });
    });
  });
});
