import { sign } from 'jsonwebtoken';
import helmet from 'helmet';
import User from './models/user/schema';
import accessControlHeaders from './middlewares/security/access-control-headers';

import config from './config/express-config';

export default function securityWrapper(app) {
  // Checking headers
  app.use(accessControlHeaders);
  app.use(helmet());

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
      .then(user => checkUser(req.body, user))
      .then((finalUser) => {
        const payload = { sub: finalUser.id, isActive: finalUser.isActive };
        const token = sign(payload, config.server.security.secret, { expiresIn: 10 });
        res.json({ token });
      })
      .catch(err =>
        res.status(403).send({
          success: false,
          message: 'Bad username/password combination.',
          error: err,
        }));
  });
}
