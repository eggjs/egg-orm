'use strict';

module.exports = (app) => {
  const { DataTypes: { BIGINT, TEXT, STRING } } = app.model;
  const Post = app.model.define('Post', {
    id: { type: BIGINT, autoIncrement: true },
    content: TEXT,
    description: STRING,
  })
  return Post;
};
