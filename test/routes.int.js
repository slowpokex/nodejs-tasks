import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import faker from 'faker';
import app from '../src';

chai.config.includeStack = true;

describe('## Misc', () => {
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

  describe('# POST /register', () => {
    it('should return 500 status (Empty body)', (done) => {
      request(app)
        .post('/register')
        .expect(httpStatus.INTERNAL_SERVER_ERROR)
        .then(() => {
          done();
        })
        .catch(done);
    });
  });

  describe('# POSTS /login', () => {
    const user = {
      login: faker.name.findName(),
      password: faker.random.hexaDecimal(),
    };

    it('should return 200 status (Empty body)', (done) => {
      request(app)
        .post('/login')
        .expect(httpStatus.OK)
        .then(() => {
          done();
        })
        .catch(done);
    });

    it('should return 200 status (With body)', (done) => {
      request(app)
        .post('/login')
        .send(user)
        .expect(httpStatus.OK)
        .then((res) => {
          console.log(res.body);
          done();
        })
        .catch(done);
    });
  });
});
