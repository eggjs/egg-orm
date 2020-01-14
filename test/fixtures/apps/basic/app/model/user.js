'use strict';

module.exports = (app, Base) => {
  const { STRING } = Base;

  class User extends Base {
    static get schema() {
      return {
        name: { type: STRING, allowNull: false },
      };
    }
  }

  return User;
};
