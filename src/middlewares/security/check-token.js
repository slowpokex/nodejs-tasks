import { verify } from 'jsonwebtoken';
import { promisify } from 'util';
import config from '../../config/express-config';

const verifyAsync = promisify(verify);

const errorMessage = {
  success: false,
  message: 'No token provided.',
};

export default function checkToken(req, res, next) {
  const token = req.headers['x-access-token'];
  if (req.method === 'OPTIONS') {
    return next();
  }
  if (!token) {
    return res.status(403).send(errorMessage);
  }
  return verifyAsync(token, config.server.security.secret)
    .then(() => next())
    .catch(err =>
      res.json({ success: false, message: 'Failed to authenticate token.', error: err }));
}
