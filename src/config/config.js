import lodash from 'lodash';
import dotenv from 'dotenv';

// Import env variables
dotenv.config();

const DEFAULT = {
  env: process.env.NODE_ENV || 'development',
  server: {
    host: process.env.HOST || 'http://localhost',
    port: process.env.PORT || 3000,
    security: {
      secret: process.env.SECRET || 'abracadabra',
    },
  },
  mongo: {
    uri: process.env.MONGODB_URI || 'mongodb://192.168.99.100:32768/express-task',
  },
};

export default lodash.assign({}, DEFAULT);
