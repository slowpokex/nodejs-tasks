export default function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token, X-Access-Token, x-access-token');
  next();
}
