'use strict';

exports.orm = {
  client: 'mysql',
  database: 'test',
  host: 'localhost',
  port: 3306,
  user: 'root',

  delegate: 'model',
  baseDir: 'model',
  migrations: 'database',

  define: {
    underscored: true,
  },

  // or put your config into datasources array to connect multiple databases
  // datasources: [],
};
