import { sign } from 'jsonwebtoken';
import helmet from 'helmet';
import lodash from 'lodash';
import session from 'express-session';

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';

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

  initFacebookAuth(passport);
  initTwitterAuth(passport);
  initGoogleAuth(passport);

  app.use(passport.initialize());
  app.use(passport.session());

  app.post('/auth/local',
    passport.authenticate('local', {
      successRedirect: '/v2/api',
      failureRedirect: '/auth/local',
      failureFlash: true,
    }));

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

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
}
