import mongoose from 'mongoose';
import config from './config/express-config';

mongoose.Promise = Promise;
const db = mongoose.connect(config.mongo.url);

export default db;
