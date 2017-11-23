import postgres from './config';
import security from './security';

export default {
  name: 'NodeMP HW App',
  environment: process.env.NODE_ENV || 'development',
  server: {
    host: 'http://localhost',
    port: process.env.PORT || 3000,
    security,
    mongo: {
      url: process.env.MONGO_DB_URL || 'mongodb://localhost:27017/express-task',
    },
    postgres,
  },
};
