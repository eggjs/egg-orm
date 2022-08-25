import { Column, Bone, HasMany } from 'leoric';
import Post from './post';

export default class User extends Bone {
  @Column({ allowNull: false })
  nickname: string;

  @Column()
  email: string;

  @Column()
  createdAt: Date;

  @HasMany()
  posts: Post[];
}
