export default function redirect(req, res, next) {
  return req.isAuthenticated() ? next() : res.redirect('/auth');
}
