import 'babel-polyfill';
import mongoose from 'mongoose';

import app from './config/app';
import config from './config/config';

mongoose.Promise = Promise;
mongoose.connect(config.mongo.url, {
  useMongoClient: true,
});

// Hometask 1: NodeJS Modules. NPM
// import './hometasks/modules';

// Hometask 2: Async development introduction
// import './hometasks/async-task';

// Hometask 3: Streams
// In this cases, compile to dist directory and run 'node dist' with parameters
// import './utils/streams';

// Hometask 4: Http Servers & Middleware && Hometask 7: Simple Mongo Server
// import './http-servers';
app.listen(config.server.port, () => console.log(`App listening on port ${config.server.port}!`));

export default app;
