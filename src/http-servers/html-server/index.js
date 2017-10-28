import { createServer } from 'http';
import { readFileSync, createReadStream } from 'fs';
import { replace } from 'lodash';
import through from 'through2';
import split from 'split2';
import { HTML_FILE, REPLACE_TAG } from '../server-config';

// Bad solution (Don't use it in production)
// export default createServer((req, res) => {
//   const htmlFile = readFileSync(HTML_FILE);
//   res.writeHead(200, { 'Content-Type': 'text/html' });
//   res.end(replace(htmlFile, REPLACE_TAG, 'Hello, World!'));
// });

// Good solution
const replacer = () =>
  through((chunk, enc, cb) => cb(null, replace(chunk.toString(), REPLACE_TAG, 'Hello, World!')));

export default createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  createReadStream(HTML_FILE)
    .pipe(split())
    .pipe(replacer())
    .pipe(res);
});
