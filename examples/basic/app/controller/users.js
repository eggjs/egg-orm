'use strict';

module.exports = app => {
  return class UsersController extends app.Controller {
    async show() {
      const user = await this.ctx.model.User.findByPk(this.ctx.params.id);
      this.ctx.body = user;
    }

    async create() {
      const user = await app.model.User.create({
        nickname: this.ctx.request.body.nickname,
        email: this.ctx.request.body.email,
      });
      this.ctx.body = user;
    }
  };
};
