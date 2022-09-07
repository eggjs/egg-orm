
import { ContextProto, AccessLevel } from '@eggjs/tegg';
import User from '../../app/model/user';

import InjectModel from './util';

@ContextProto({
  accessLevel: AccessLevel.PUBLIC,
})
export default class HelloService {
  @InjectModel()
  private readonly User: typeof User;

  async sayHello(id: number) {
    const user = await this.User.findOne(id);
    return `hello ${user.nickname}`;
  }
}
