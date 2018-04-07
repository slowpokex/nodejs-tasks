import { sign } from 'jsonwebtoken';
import lodash from 'lodash';

import User from '../models/user/schema';
import userController from '../models/user/controller';

import accessControlHeaders from '../middlewares/security/access-control-headers';
import config from './config';

const checkUser = (password, userFromDb) => new Promise((resolve, reject) => {
  if (!userFromDb) {
    return reject({ noUser: true });
  }
  const wrappedUser = new User(userFromDb);
  wrappedUser.comparePassword(password, (err, isMatch) => {
    if (!isMatch) {
      return reject({ notMatch: true });
    }
    if (err) {
      return reject(err);
    }
    return resolve(userFromDb);
  });
});

const getPayload =
  user => lodash.pick(user, ['login', 'displayName', 'email', 'role']);

export default (app) => {
  app.use(accessControlHeaders);
  app.post('/register', (req, res, next) => userController.create(req, res, next));
  app.post('/auth', function (req, res) {
    User.findOne({ login: req.body.login })
      .then(findUser => checkUser(req.body.password, findUser))
      .then((user) => {
        const payload = getPayload(user);
        const token = sign(payload, config.server.security.secret, { expiresIn: 100 });
        return res.json({
          status: 200,
          message: 'OK',
          payload,
          token,
        });
      })
      .catch(err =>
        res.status(403).send({
          success: false,
          message: 'Bad username/password combination.',
          error: err,
        }));
  });
};
