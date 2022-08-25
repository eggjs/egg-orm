import Post from '../app/model/post';
import User from '../app/model/user';

declare module 'egg' {
  interface IModel {
    Post: typeof Post;
    User: typeof User;
  }
}
