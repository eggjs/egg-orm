'use strict';

exports.orm = {
  database: 'egg-orm',
  sequelize: true,
  delegate: 'orm',
};

exports.keys = 'hello';

exports.security = {
  csrf: false,
};
