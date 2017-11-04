import lodash from 'lodash';
import { parse } from 'url';

export default function (req, res, next) {
  const query = parse(req.url).query || '';
  res.parsedQuery = {};

  const queryEntries = lodash.split(query, ';');
  lodash.each(queryEntries, (item) => {
    const entry = lodash.split(item.trim(), '=');
    res.parsedQuery[entry[0]] = entry[1];
  });
  next();
}
