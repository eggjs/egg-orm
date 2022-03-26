import { Application } from 'egg';
import PostFactory from './post';

export default function(app: Application) {
  const { Bone, Column, HasMany, DataTypes: { STRING } } = app.model;

  class User extends Bone {
    @Column({ allowNull: false })
    nickname: string;

    @Column()
    email: string;

    @Column()
    createdAt: Date;

    @HasMany()
    posts: ReturnType<typeof PostFactory>[];
  }

  return User;
};
