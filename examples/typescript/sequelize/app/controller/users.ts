import { Controller } from "egg";

export default class UsersController extends Controller {
  async show() {
    const user = await this.ctx.model.User.findOne({
      where: {
        id: this.ctx.params.id,
      }
    });

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
