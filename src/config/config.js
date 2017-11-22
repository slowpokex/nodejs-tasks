require('babel-core/register');

module.exports = {
  development: {
    username: 'root',
    password: 'root',
    database: 'node-server',
    host: '192.168.99.100',
    port: 32768,
    dialect: 'postgres',
  },
  test: {
    username: 'root',
    password: 'root',
    database: 'node-server',
    host: '192.168.99.100',
    port: 32768,
    dialect: 'postgres',
  },
  production: {
    username: 'root',
    password: 'root',
    database: 'node-server',
    host: '192.168.99.100',
    port: 32768,
    dialect: 'postgres',
  },
};
