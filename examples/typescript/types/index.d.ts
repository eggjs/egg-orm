import PostFactory from '../app/model/post';
import UserFactory from '../app/model/user';

declare module 'egg' {
  interface IModel {
    Post: ReturnType<typeof PostFactory>;
    User: ReturnType<typeof UserFactory>;
  }
}
