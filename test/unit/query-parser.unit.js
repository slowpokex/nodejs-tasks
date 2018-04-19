import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { spy } from 'sinon';
import queryParser from '../../src/middlewares/query-parser';

chai.use(sinonChai);
chai.config.includeStack = true;

/* eslint no-unused-expressions: "off" */
/* eslint no-undef: "off" */
describe('## Test queryParser', () => {
  describe('# Test empty values', () => {
    it('Correct work with empty values', () => {
      const next = spy();
      queryParser({
        url: '',
      }, {}, next);
      expect(next).to.have.been.called;
    });
  });

  describe('# Test with some values', () => {
    const req = {
      url: 'http://localhost:8080/api/user?type=admin&debug=true&secret=lol',
    };
    const res = {};
    const next = spy();
    it('Correct work with some values', () => {
      queryParser(req, res, next);
      expect(res.parsedQuery.type).to.equal('admin');
      expect(res.parsedQuery.debug).to.equal('true');
      expect(res.parsedQuery.secret).to.equal('lol');
      expect(next).to.have.been.called;
    });
  });
});
