export default {
  environment: process.env.NODE_ENV || 'dev',
  server: {
    port: process.env.PORT || 3000,
  },
  mongo: {
    url: process.env.MONGO_DB_URL || 'mongodb://localhost:27017/express-task',
  },
};
