import { parse } from 'url';

export default function (req, res, next) {
  res.parsedQuery = parse(req.url, true).query || {};
  next();
}
