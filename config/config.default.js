'use strict';

const debug = require('debug')('egg-orm');

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

  logger: {
    logQuery(sql, duration, options) {
      debug('[query] [%s] %s', duration, sql);
    },
    logQueryError(err, sql, duration, options) {
      debug('[query] [%s] %s', duration, sql, err);
    }
  }

  // or put your config into datasources array to connect multiple databases
  // datasources: [],
};
