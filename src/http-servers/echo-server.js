import { createServer } from 'http';

export default createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  req.pipe(res);
});
