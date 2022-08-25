'use strict';

const { Bone } = require('leoric');

exports.orm = {
  database: 'egg-orm',
  port: process.env.MYSQL_PORT,
  // connect to Bone directly
  Bone,
};

exports.keys = 'hello';

exports.security = {
  csrf: false,
};
