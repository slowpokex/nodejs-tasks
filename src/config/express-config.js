export default {
  environment: process.env.NODE_ENV || 'dev',
  server: {
    port: process.env.PORT || 3000,
    security: {
      secret: 'abracadabra',
    },
  },
  mongo: {
    url: process.env.MONGO_DB_URL || 'mongodb://localhost:27017/express-task',
  },
};
