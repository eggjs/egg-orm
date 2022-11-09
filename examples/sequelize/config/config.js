'use strict';

exports.orm = {
  database: 'egg-orm',
  sequelize: true,
  port: process.env.MYSQL_PORT,
  exclude: 'common',
};

exports.keys = 'hello';

exports.security = {
  csrf: false,
};
