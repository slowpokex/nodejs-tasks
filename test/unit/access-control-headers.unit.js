import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { spy } from 'sinon';
import accessControl from '../../src/middlewares/security/access-control-headers';

chai.use(sinonChai);
chai.config.includeStack = true;

/* eslint no-unused-expressions: "off" */
/* eslint no-undef: "off" */
describe('## Test access control headers', () => {
  const res = {
    header: spy(),
  };
  const next = spy();
  it('Correct work', () => {
    accessControl(null, res, next);
    expect(res.header).to.have.been.calledWith('Access-Control-Allow-Origin', '*');
    expect(res.header).to.have.been.calledWith('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    expect(res.header).to.have.been.calledWith('Access-Control-Allow-Headers',
      'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token, X-Access-Token, x-access-token');
    expect(next).to.have.been.called;
  });
});
