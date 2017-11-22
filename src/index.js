import 'babel-register';
import 'babel-polyfill';
import app from './app';
import config from './config';

// Hometask 1: NodeJS Modules. NPM
// import './hometasks/modules';

// Hometask 2: Async development introduction
// import './hometasks/async-task';

// Hometask 3: Streams
// In this cases, compile to dist directory and run 'node dist' with parameters
// import './utils/streams';

// Hometask 4: Http Servers & Middleware
// import './http-servers';
app.listen(config.server.port, () => console.log(`App listening on port ${config.server.port}!`));

