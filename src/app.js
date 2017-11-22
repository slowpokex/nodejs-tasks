import express from 'express';
import morgan from 'morgan';
import path from 'path';

// Sequelize init
import './models';

import cookieParser from './middlewares/cookie-parser';
import queryParser from './middlewares/query-parser';
import router from './routes';

const app = express();

app.use(cookieParser);
app.use(queryParser);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));

app.use('/static', express.static(path.join(__dirname, 'static')));

app.use('/api', router);

export default app;
