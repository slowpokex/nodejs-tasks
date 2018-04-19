import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import { sign } from 'jsonwebtoken';
import faker from 'faker';

import app from '../../src';
import config from '../../src/config/config';

chai.config.includeStack = true;

const getToken = () => sign({}, config.server.security.secret, { expiresIn: 100 });

/* eslint no-unused-expressions: "off" */
/* eslint no-undef: "off" */
describe('## User integration tests', () => {
  const newUser = {
    login: faker.internet.userName(),
    password: faker.internet.password(),
    displayName: faker.name.findName(),
    role: 'USER',
  };

  describe('# GET /users', () => {
    it('should return unauthorized status', (done) => {
      request(app)
        .get('/api/users')
        .set('x-access-token', '')
        .expect(httpStatus.FORBIDDEN)
        .then((res) => {
          expect(res.body.message).to.equal('No token provided.');
          done();
        })
        .catch(done);
    });

    it('should return results', (done) => {
      request(app)
        .get('/api/users')
        .set('x-access-token', getToken())
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });

  describe('# POST /users', () => {
    it('should return unauthorized status', (done) => {
      request(app)
        .post('/api/users')
        .set('x-access-token', '')
        .send(newUser)
        .expect(httpStatus.FORBIDDEN)
        .then((res) => {
          expect(res.body.message).to.equal('No token provided.');
          done();
        })
        .catch(done);
    });

    it('should correct add new user', (done) => {
      request(app)
        .post('/api/users')
        .set('x-access-token', getToken())
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

  describe('# GET /users/:login', () => {
    it('should return unauthorized status', (done) => {
      request(app)
        .get(`/api/users/${newUser.login}`)
        .set('x-access-token', '')
        .expect(httpStatus.FORBIDDEN)
        .then((res) => {
          expect(res.body.message).to.equal('No token provided.');
          done();
        })
        .catch(done);
    });

    it('should correct return required user', (done) => {
      request(app)
        .get(`/api/users/${newUser.login}`)
        .set('x-access-token', getToken())
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.login).to.equal(newUser.login);
          expect(res.body.displayName).to.equal(newUser.displayName);
          expect(res.body.role).to.equal('USER');
          done();
        })
        .catch(done);
    });
  });
});
