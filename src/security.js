import { sign } from 'jsonwebtoken';
import helmet from 'helmet';
import lodash from 'lodash';
import session from 'express-session';

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import User from './models/user/schema';
import accessControlHeaders from './middlewares/security/access-control-headers';
import config from './config/express-config';

const checkUser = (password, userFromDb) => new Promise((resolve, reject) => {
  const wrappedUser = new User(userFromDb);
  wrappedUser.comparePassword(password, (err, isMatch) => {
    if (err || !isMatch) {
      return reject(err, isMatch);
    }
    return resolve(userFromDb);
  });
});

const getPayload =
  user => lodash.pick(user, ['isActive', 'firstName', 'lastName', 'id']);

const basicSetup = (app) => {
  app.use(accessControlHeaders);
  app.use(helmet());
};

export function setupBasicSecurity(app) {
  basicSetup(app);

  // Auth
  app.post('/auth', function (req, res) {
    User.findOne({ id: req.body.id })
      .then(findUser => checkUser(req.body.password, findUser))
      .then((user) => {
        const payload = getPayload(user);
        const token = sign(payload, config.server.security.secret, { expiresIn: 100 });
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

export function setupPassportSecurity(app) {
  basicSetup(app);
  app.use(session({ secret: config.server.security.secret }));

  // Init passport
  passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'password',
    session: false,
  }, (id, password, done) => {
    User.findOne({ id })
      .then(user => checkUser(password, user))
      .then((user) => {
        done(null, user);
      })
      .catch(done);
  }));

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    User.findOne({ id })
      .then((user) => {
        done(null, user);
      })
      .catch(done);
  });

  app.use(passport.initialize());
  app.use(passport.session());

  app.post('/auth',
    passport.authenticate('local', {
      successRedirect: '/api',
      failureRedirect: '/login',
      failureFlash: true,
    }));
}
