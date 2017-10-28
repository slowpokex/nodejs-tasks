import { SERVER_PORT } from './server-config';

// import textServer from './plain-text-server';
// import htmlServer from './html-server';
// import jsonServer from './json-server';
import echoServer from './echo-server';

// textServer.listen(SERVER_PORT,
//   () => console.log(`Text server listen on ${SERVER_PORT} port;`));

// htmlServer.listen(SERVER_PORT,
//   () => console.log(`Html server listen on ${SERVER_PORT} port;`));

// jsonServer.listen(SERVER_PORT,
//   () => console.log(`Json server listen on ${SERVER_PORT} port;`));

echoServer.listen(SERVER_PORT,
  () => console.log(`Echo server listen on ${SERVER_PORT} port;`));
