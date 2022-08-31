import { Controller } from "egg";

export default class UsersController extends Controller {
  async show() {
    // TODO: sequelize adapter methods like findByPk() isn't provided by leoric yet
    // const user = await this.ctx.model.User.findByPk(this.ctx.params.id);
    const user = await this.ctx.model.User.findOne(this.ctx.params.id);
    this.ctx.body = user;
  }

  async create() {
    const user = await this.app.model.User.create({
      nickname: this.ctx.request.body.nickname,
      email: this.ctx.request.body.email,
    });
    this.ctx.body = user;
  }
};
