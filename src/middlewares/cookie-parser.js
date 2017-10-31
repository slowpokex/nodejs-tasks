import lodash from 'lodash';

export default function (req, res, next) {
  const cookies = req.headers.cookie || '';
  res.parsedCookies = {};
  const entries = lodash.split(cookies, ';');

  lodash.each(entries, (item) => {
    const entry = lodash.split(item.trim(), '=');
    res.parsedCookies[entry[0]] = entry[1];
  });
  next();
}
