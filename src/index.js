import 'babel-polyfill';
import mongoose from 'mongoose';

import app from './config/app';
import config from './config/config';

mongoose.Promise = global.Promise;
mongoose.connect(config.mongo.uri, { useMongoClient: true });

mongoose.connection.once('open', function () {
  console.log(`Mongoose connection opened on process ${process.pid}`);
});

app.listen(config.server.port, () =>
  console.log(`App listening on port ${config.server.port}!`));

export default app;
