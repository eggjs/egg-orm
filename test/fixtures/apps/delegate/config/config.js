'use strict';

exports.orm = {
  database: 'egg-orm',
  sequelize: true,
  delegate: 'orm',
  port: process.env.MYSQL_PORT,
};

exports.keys = 'hello';

exports.security = {
  csrf: false,
};
