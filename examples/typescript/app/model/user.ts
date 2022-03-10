import { Application } from 'egg';

export default function(app: Application) {
  const { Bone, Column, DataTypes: { STRING } } = app.model;

  class User extends Bone {
    @Column({ allowNull: false })
    nickname: string;

    @Column()
    email: string;

    @Column()
    createdAt: Date;
  }

  return User;
};
