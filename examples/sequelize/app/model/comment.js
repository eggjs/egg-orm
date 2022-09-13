'use strict';

const { DataTypes: { BIGINT, TEXT } } = require('../../../..');
const Base = require('./common/base');

module.exports = class Comment extends Base {
  static attributes = {
    id: { type: BIGINT, primaryKey: true, autoIncrement: true },
    content: { type: TEXT },
    userId: { type: BIGINT, allowNull: false },
  };
};
