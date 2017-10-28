import express from 'express';
import cookieParser from './middlewares/cookie-parser';
import queryParser from './middlewares/query-parser';

const app = express();

app.use(cookieParser);
app.use(queryParser);

export default app;
