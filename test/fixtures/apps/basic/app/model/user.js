'use strict';

module.exports = (app, Model) => {
  const { STRING } = Model;

  class User extends Model {
    static get schema() {
      return {
        name: { type: STRING, allowNull: false },
      };
    }
  }

  return User;
};
