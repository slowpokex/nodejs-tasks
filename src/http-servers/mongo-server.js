import { createServer } from 'http';
import { promisify } from 'util';
import { MongoClient } from 'mongodb';
import lodash from 'lodash';

import config from '../config/express-config';
import citiesData from '../data/cities';

const mongoConnect = promisify(MongoClient.connect);

const server = cities => createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  cities.find({}).toArray((err, result) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    }
    res.end(JSON.stringify(lodash.sample(result)));
  });
});

mongoConnect(config.mongo.url)
  .then((db) => {
    console.log('Connected successfully to server');
    return db;
  }).then((db) => {
    let cities = db.collection('cities');
    if (!cities) {
      cities = db.createCollection('cities');
    }

    if (cities.count({}) === 0) {
      cities.insertMany(citiesData);
    }

    const mongoServer = server(cities);
    mongoServer.listen(3000, () => console.log('Mongo server listen on 3000 port;'));
    mongoServer.on('close', () => {
      db.close();
    });
  }).catch((err) => {
    console.log('Connection failed:', err);
  });

export default server;
