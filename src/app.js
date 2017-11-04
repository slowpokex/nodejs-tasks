import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path';

import db from './db';
import cookieParser from './middlewares/cookie-parser';
import queryParser from './middlewares/query-parser';
import accessControlHeaders from './middlewares/security/access-control-headers';

import router from './routes';

const app = express();

app.use(accessControlHeaders);
app.use(helmet());
app.use(cookieParser);
app.use(queryParser);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));

// Auth
// app.post('/auth', );

app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/api', router);

export default app;
