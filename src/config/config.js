require('dotenv').config();

const DEFAULT = {
  env: process.env.NODE_ENV || 'development',
  server: {
    host: process.env.HOST || 'http://localhost',
    port: process.env.PORT || 3000,
    security: {
      secret: process.env.SECRET || 'abracadabra',
      auth: {
        twitter: {
          consumerKey: process.env.TWITTER_CONSUMER_KEY,
          consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
          callbackUrl: process.env.TWITTER_CALLBACK_URL,
        },
        facebook: {
          clientID: process.env.FACEBOOK_CLIENT_ID,
          clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
          callbackUrl: process.env.FACEBOOK_CALLBACK_URL,
        },
        google: {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackUrl: process.env.GOOGLE_CALLBACK_URL,
        },
      },
    },
  },
  mongo: {
    url: process.env.MONGODB_URI || 'mongodb://192.168.99.100:32768/express-task',
  },
};

export default Object.assign({}, DEFAULT);
