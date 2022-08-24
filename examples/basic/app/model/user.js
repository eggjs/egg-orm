'use strict';

module.exports = app => {
  const { Bone, DataTypes: { STRING, DATE } } = app.model;

  class User extends Bone {
    static attributes = {
      nickname: { type: STRING, allowNull: false },
      email: { type: STRING, allowNull: true },
      createdAt: { type: DATE },
    };
  }

  return User;
};
