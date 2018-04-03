import { sign } from 'jsonwebtoken';
import helmet from 'helmet';
import lodash from 'lodash';
import session from 'express-session';
import flash from 'connect-flash';

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';

import User from '../models/user/schema';
import UserFacade from '../models/user/facade';

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
  user => lodash.pick(user, ['isActive', 'firstName', 'lastName', 'id']);

const basicSetup = (app) => {
  app.use(accessControlHeaders);
  app.use(helmet());
};

export function setupBasicSecurity(app) {
  basicSetup(app);
  app.post('/auth', function (req, res) {
    User.findOne({ _id: req.body.id })
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

function initFacebookAuth(pass) {
  pass.use(new FacebookStrategy({
    clientID: config.server.security.auth.facebook.clientID,
    clientSecret: config.server.security.auth.facebook.clientSecret,
    callbackURL: config.server.security.auth.facebook.callbackUrl,
  }, (token, refreshToken, profile, done) => {
    process.nextTick(() => {
      User.findOne({ id: profile.id })
        .then((user) => {
          if (user) {
            done(null, user);
          }
          return User.create({
            id: profile.id,
            displayName: profile.displayName,
            password: token,
          });
        })
        .then(newUser => done(null, newUser))
        .catch(done);
    });
  }));
}

function initTwitterAuth(pass) {
  pass.use(new TwitterStrategy({
    consumerKey: config.server.security.auth.twitter.consumerKey,
    consumerSecret: config.server.security.auth.twitter.consumerSecret,
    callbackURL: config.server.security.auth.twitter.callbackUrl,
  }, (token, refreshToken, profile, done) => {
    process.nextTick(() => {
      User.findOne({ id: profile.id })
        .then((user) => {
          if (user) {
            done(null, user);
          }
          return User.create({
            id: profile.id,
            displayName: profile.displayName,
            password: token,
          });
        })
        .then(newUser => done(null, newUser))
        .catch(done);
    });
  }));
}

function initGoogleAuth(pass) {
  pass.use(new GoogleStrategy({
    clientID: config.server.security.auth.google.clientID,
    clientSecret: config.server.security.auth.google.clientSecret,
    callbackURL: config.server.security.auth.google.callbackUrl,
  }, (token, refreshToken, profile, done) => {
    process.nextTick(() => {
      User.findOne({ id: profile.id })
        .then((user) => {
          if (user) {
            done(null, user);
          }
          return User.create({
            id: profile.id,
            displayName: profile.displayName,
            password: token,
          });
        })
        .then(newUser => done(null, newUser))
        .catch(done);
    });
  }));
}

export function setupPassportSecurity(app) {
  basicSetup(app);

  app.use(session({
    secret: config.server.security.secret,
    saveUninitialized: true, // saved new sessions
    resave: false, // do not automatically write to the session store
    cookie: { httpOnly: true, maxAge: 2419200000 },
  }));

  passport.use(new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password',
    session: false,
    passReqToCallback: true,
  }, (req, login, password, done) => {
    UserFacade.findOne({ login })
      .then(user => checkUser(password, user))
      .then((user) => {
        done(null, user);
      })
      .catch((err) => {
        if (err.noUser) {
          return done(null, false, { message: 'Invalid user ID' });
        }
        if (err.notMatch) {
          return done(null, false, { message: 'Oops! Wrong password.' });
        }
        done(err);
      });
  }));

  initFacebookAuth(passport);
  initTwitterAuth(passport);
  initGoogleAuth(passport);

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then((user) => {
        done(null, user);
      })
      .catch(done);
  });


  app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.json({ success: false, message: info.message });
      }

      req.logIn(user, (loginErr) => {
        if (loginErr) {
          return res.json({ success: false, message: loginErr });
        }
        return res.json({ success: true, message: 'authentication succeeded' });
      });
    })(req, res, next);
  });

  app.get('/logout', (req, res) => {
    req.logout();
    return res.json({ success: true });
  });

  app.post('/register', (req, res) => {
    UserFacade.findOne({ login: req.body.login })
      .then((user) => {
        if (user) {
          return res.json({ success: false, message: 'Login already in use' });
        }
        return UserFacade.create(req.body);
      })
      .then(() => res.json({ success: true }))
      .catch((err) => {
        console.error(err);
        return res.json({ success: false });
      });
  });

  app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
  app.get('/auth/facebook/callback', passport.authenticate('facebook',
    { successRedirect: '/v2/api', failureRedirect: '/login' }));

  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/auth/twitter/callback', passport.authenticate('twitter',
    { successRedirect: '/v2/api', failureRedirect: '/login' }));

  app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] }));

  app.get('/auth/google/callback',
    passport.authenticate('google', {
      successRedirect: '/v2/api',
      failureRedirect: '/login' }));
}
