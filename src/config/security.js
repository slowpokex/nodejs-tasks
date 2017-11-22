export default {
  secret: 'abracadabra',
  auth: {
    twitter: {
      consumerKey: 'HASb1uxZ5Oanuz3E2jakfwuPO',
      consumerSecret: 'jz0NeotePNlkwiexhWZunwl53M7L5SrVtjwTH978uR60y2fIkH',
      callbackUrl: 'http://localhost:3000/auth/twitter/callback',
    },
    facebook: {
      clientID: '1549174561843511',
      clientSecret: '18f41fb2f9ee9c3f7e57fc9783534c67',
      callbackUrl: 'http://localhost:3000/auth/facebook/callback',
    },
    google: {
      clientID: '480723635668-iebb8vqkch34339ekumlsiqiro75inqv.apps.googleusercontent.com',
      clientSecret: 'jjceLkx2ETyRZt1Y9arTbFlh',
      callbackUrl: 'http://localhost:3000/auth/google/callback',
    },
  },
};
