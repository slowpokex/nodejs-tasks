import { sign } from 'jsonwebtoken';
import helmet from 'helmet';
import User from './models/user/schema';
import accessControlHeaders from './middlewares/security/access-control-headers';
import config from './config/express-config';

export default function securityWrapper(app) {
  // Checking headers
  app.use(accessControlHeaders);
  app.use(helmet());

  function getPayload(user) {
    return {
      isActive: user.isActive,
      firstName: user.firstName,
      lastName: user.lastName,
      id: user.id,
    };
  }

  const checkUser = (incomUser, userFromDb) => new Promise((resolve, reject) => {
    const wrappedUser = new User(userFromDb);
    wrappedUser.comparePassword(incomUser.password, (err, isMatch) => {
      if (err || !isMatch) {
        return reject(err, isMatch);
      }
      return resolve(userFromDb);
    });
  });

  // Auth
  app.post('/auth', function (req, res) {
    User.findOne({ id: req.body.id })
      .then(findUser => checkUser(req.body, findUser))
      .then((user) => {
        const payload = getPayload(user);
        const token = sign(payload, config.server.security.secret, { expiresIn: 1000 });
        res.json({ status: 200, message: 'OK', payload, token });
      })
      .catch(err =>
        res.status(403).send({
          success: false,
          message: 'Bad username/password combination.',
          error: err,
        }));
  });
}
