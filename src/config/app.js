import express from 'express';
import expressValidation from 'express-validation';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import compress from 'compression';
import bodyParser from 'body-parser';
import httpStatus from 'http-status';

// Run security endpoints
import security from './security';

import APIError from '../bin/api-error';
import checkToken from '../middlewares/security/check-token';
import cookieParser from '../middlewares/cookie-parser';
import queryParser from '../middlewares/query-parser';
import router from './routes';
import config from './config';

const app = express();

app.use(cookieParser);
app.use(queryParser);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(compress());

if (config.env !== 'test') {
  app.use(morgan('tiny'));
}

security(app); // and add 'checkToken' for verifying session
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/api', checkToken, router);

/**
 *  Error handling for our application
 */
app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
    const error = new APIError(unifiedErrorMessage, err.status, true);
    return next(error);
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic);
    return next(apiError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND);
  return next(err);
});

// error handler, send stacktrace only during development
app.use((err, req, res, next) => // eslint-disable-line no-unused-vars
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: config.env === 'development' ? err.stack : {},
  }));

export default app;
