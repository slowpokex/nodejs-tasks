import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import rootConfig from '../config';

const env = rootConfig.environment;
const basename = path.basename(__filename);
const config = rootConfig.server.postgres[env];
const location = path.join(__dirname, 'orm', 'entities');
const db = {};

let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(location)
  .filter(file => file.indexOf('.') !== 0 && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(location, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.sequelize.sync();

export default db;
