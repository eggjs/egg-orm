'use strict';

const { Bone } = require('../../../../..');

module.exports = class Base extends Bone {
  static shardingKey = 'userId';
};
