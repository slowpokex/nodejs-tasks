import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path';
import bluebird from 'bluebird';

import config from './config/express-config';
import cookieParser from './middlewares/cookie-parser';
import queryParser from './middlewares/query-parser';
import accessControlHeaders from './middlewares/access-control-headers';

import router from './routes';

const app = express();

mongoose.Promise = bluebird;
mongoose.connect(config.mongo.url);

app.use(accessControlHeaders);
app.use(helmet());
app.use(cookieParser);
app.use(queryParser);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));

app.use('/static', express.static(path.join(__dirname, 'static')));

app.use('/', router);

export default app;
