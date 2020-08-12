'use strict';

module.exports = (app, Model) => {
  // const { STRING } = Model;

  class User extends Model {
    // static get schema() {
    //   return {
    //     nickname: { type: STRING, allowNull: false },
    //     email: { type: STRING, allowNull: true },
    //   };
    // }
  }

  return User;
};
