import express from 'express';
import morgan from 'morgan';
import path from 'path';

import db from './db';
import { setupPassportSecurity } from './security';

// import checkToken from './middlewares/security/check-token';
import cookieParser from './middlewares/cookie-parser';
import queryParser from './middlewares/query-parser';
import mustAuth from './middlewares/security/must-auth';

// import checkToken from './middlewares/security/check-token';
import router from './routes';

const app = express();

app.use(cookieParser);
app.use(queryParser);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));

// setupSecurity(app); // and add 'checkToken' for verifying session
setupPassportSecurity(app);

app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/api', mustAuth, router);

export default app;
