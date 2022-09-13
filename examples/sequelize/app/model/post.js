'use strict';

module.exports = function(app) {
  const { DataTypes: { BIGINT, TEXT, STRING } } = app.model;
  const Post = app.model.define('Post', {
    id: { type: BIGINT, autoIncrement: true },
    content: TEXT,
    description: STRING,
    userId: { type: BIGINT, allowNull: false },
  });
  return Post;
};
